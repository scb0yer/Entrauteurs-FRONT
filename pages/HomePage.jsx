import("../src/assets/homepage.css");
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState, useEffect } from "react";
import Story from "../components/Story";
import { Link, useNavigate } from "react-router-dom";
import logowattpad from "../src/assets/wattpad_min.png";
import logodiscord from "../src/assets/discord_min.png";
import Loading from "../components/Loading";
import BookImg from "../components/BookImg";

export default function HomePage({
  token,
  storiesRead,
  newStateHP,
  setNewStateHP,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [readList, setReadList] = useState(null);
  const [concours, setConcours] = useState([]);
  const [pageConcours, setPageConcours] = useState(1);
  const [bestStories, setBestStories] = useState([]);
  const [pageBestStories, setPageBestStories] = useState(1);
  const [authors, setAuthors] = useState([]);
  const [lastAddedStories, setLastAddedStories] = useState([]);
  const [pageLastAddedStories, setPageLastAddedStories] = useState(1);
  const rating = [0, 1, 2, 3, 4];

  useEffect(() => {
    const Datas = async () => {
      try {
        if (storiesRead) {
          const readBooks = JSON.parse(storiesRead);
          setReadList(readBooks);
        }
        const getSessions = await axios.get(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/sessions"
        );
        setConcours(getSessions.data);
        const response2 = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/books?sort=note&limit=3&page=${pageBestStories}`
        );
        setBestStories(response2.data);
        const response3 = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writers/connexion`
        );
        setAuthors(response3.data);
        const response4 = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/books?sort=last_added&limit=5&page=${pageLastAddedStories}`
        );
        setLastAddedStories(response4.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    Datas();
  }, [newStateHP]);

  return (
    <main className="homePage">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <>
          <section>
            <div className="quote">
              <FontAwesomeIcon icon="quote-left" /> Écrire, c'est partager{" "}
              <FontAwesomeIcon icon="quote-right" />
            </div>
            <div className="description">
              <div>
                Tu écris un livre sur Wattpad ? Rejoins notre communauté
                d'auteurs, participe à des échanges d'avis, concours, sessions
                d'écriture ou ateliers, partage ta progression...
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate("/concept");
                  }}
                >
                  En savoir plus...
                </button>
              </div>
            </div>
          </section>
          <section>
            <div className="first-bloc invisible-xs">
              <div className="left-col">
                <div>
                  {/* -------------Container Résultats du concours------------- */}
                  <div>
                    <h3>Résultats du dernier concours</h3>
                    <div className="containerWithAngles">
                      <div>
                        {pageConcours > 1 && (
                          <FontAwesomeIcon
                            icon="angle-left"
                            size="2xl"
                            onClick={() => {
                              setPageConcours(pageConcours - 1);
                            }}
                          />
                        )}
                      </div>
                      <div className="storyContainer-3">
                        {concours.map((session, index) => {
                          const sortedResults = session.results.sort(
                            (a, b) => a.rank - b.rank
                          );
                          if (session === concours[concours.length - 1]) {
                            return (
                              <div key={index} className="storyContainer-3">
                                {sortedResults.map((result, ind) => {
                                  return (
                                    ind >= (pageConcours - 1) * 3 &&
                                    ind < pageConcours * 3 && (
                                      <div key={ind}>
                                        <div>Rang : #{result.rank}</div>
                                        <BookImg
                                          story_cover={result.story_cover}
                                          story_title={result.story_title}
                                          story_url={result.story_url}
                                          size={200}
                                        />
                                      </div>
                                    )
                                  );
                                })}
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div>
                        {concours[concours.length - 1].results.length >
                          pageConcours * 3 && (
                          <FontAwesomeIcon
                            icon="angle-right"
                            size="2xl"
                            onClick={() => {
                              setPageConcours(pageConcours + 1);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <br />
                  {/* -------------Container Histoires Mieux notées------------- */}
                  <div>
                    <h3>Histoires les mieux notées</h3>
                    <div className="containerWithAngles">
                      <div>
                        {pageBestStories > 1 && (
                          <FontAwesomeIcon
                            icon="angle-left"
                            size="2xl"
                            onClick={() => {
                              setPageBestStories(pageBestStories - 1);
                              setNewStateHP(!newStateHP);
                            }}
                          />
                        )}
                      </div>
                      <div className="storyContainer-3">
                        {bestStories.results.map((story, index) => {
                          let half = false;
                          if (story.note - Math.floor(story.note) > 0) {
                            half = true;
                          }
                          let isAlreadyRead = false;
                          if (readList) {
                            for (let s = 0; s < readList.length; s++) {
                              if (readList[s].book_read === story._id) {
                                isAlreadyRead = true;
                              }
                            }
                          }
                          return (
                            <div key={index}>
                              <Story story={story} />
                              {isAlreadyRead && (
                                <FontAwesomeIcon
                                  className="bookmark"
                                  icon="bookmark"
                                  size="xl"
                                  color="white"
                                />
                              )}
                              {story.note > 0 && (
                                <div className="rate">
                                  <div>
                                    {rating.map((rate, index) => {
                                      if (rate < Math.floor(story.note)) {
                                        return (
                                          <FontAwesomeIcon
                                            key={index}
                                            icon="star"
                                          />
                                        );
                                      } else if (
                                        rate === Math.floor(story.note) &&
                                        half
                                      ) {
                                        return (
                                          <FontAwesomeIcon
                                            key={index}
                                            icon="star-half"
                                          />
                                        );
                                      }
                                    })}
                                  </div>
                                  <span className="note">
                                    {Number.parseFloat(story.note).toFixed(1)}/5
                                    ({story.nbReviews})
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        {bestStories.count > pageBestStories * 3 && (
                          <FontAwesomeIcon
                            icon="angle-right"
                            size="2xl"
                            onClick={() => {
                              setPageBestStories(pageBestStories + 1);
                              setNewStateHP(!newStateHP);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* -------------Fin Container Histoires Mieux notées------------- */}
                </div>
              </div>
              <div className="right-col">
                <h3>Derniers auteurs connectés</h3>
                <div>
                  {authors.writers.map((writer, index) => {
                    return (
                      index < 20 && (
                        <div
                          className="autorName"
                          // onClick={() => navigate(`/writer/${writer._id}`)}
                          key={index}
                        >
                          <div>
                            <Link to={`/writer/${writer._id}`}>
                              <div className="link-name">
                                <div className="wattpad">
                                  {writer.writer_details.username.slice(0, 1)}
                                </div>
                                <span>
                                  {writer.writer_details.username.slice(1, 13)}
                                  {writer.writer_details.username.slice(13) &&
                                    "..."}
                                </span>
                              </div>
                            </Link>
                          </div>
                          <div>
                            {writer.writer_details.discord && (
                              <>
                                <div className="discord">
                                  {writer.writer_details.discord.slice(0, 1)}
                                </div>
                                <span>
                                  {writer.writer_details.discord.slice(1, 13)}
                                  {writer.writer_details.discord.slice(13) &&
                                    "..."}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          <br />
          <section>
            <div className="recentlyAdded invisible-xs">
              <h3>Histoires récemment ajoutées</h3>
              <br />
              <div className="containerWithAngles">
                <div>
                  {pageLastAddedStories > 1 && (
                    <FontAwesomeIcon
                      icon="angle-left"
                      size="2xl"
                      onClick={() => {
                        setPageLastAddedStories(pageLastAddedStories - 1);
                        setNewStateHP(!newStateHP);
                      }}
                    />
                  )}
                </div>
                <div className="storyContainer-4">
                  {lastAddedStories.results.map((story, index) => {
                    let half = false;
                    if (story.note - Math.floor(story.note) > 0) {
                      half = true;
                    }
                    let isAlreadyRead = false;
                    if (readList) {
                      for (let s = 0; s < readList.length; s++) {
                        if (readList[s].book_read === story._id) {
                          isAlreadyRead = true;
                        }
                      }
                    }
                    return (
                      <div key={index} style={{ position: "relative" }}>
                        <Story story={story} />
                        {isAlreadyRead && (
                          <FontAwesomeIcon
                            className="bookmark"
                            icon="bookmark"
                            size="xl"
                            color="white"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  {lastAddedStories.count > pageLastAddedStories * 5 && (
                    <FontAwesomeIcon
                      icon="angle-right"
                      size="2xl"
                      onClick={() => {
                        setPageLastAddedStories(pageLastAddedStories + 1);
                        setNewStateHP(!newStateHP);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
