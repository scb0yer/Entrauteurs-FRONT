import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import banner from "../src/assets/banner.jpg";
import "../src/assets/writerpage.css";
import logowattpad from "../src/assets/wattpad_min.png";
import logodiscord from "../src/assets/discord_min.png";
import logofacebook from "../src/assets/facebook.png";
import logoinstagram from "../src/assets/instagram.webp";
import Progression from "../components/Progression";
import AlertDisplay from "../components/Alert";
import BookImg from "../components/BookImg";
import DisplayDate from "../functions/displayDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WriterPage({
  token,
  storiesRead,
  setDisplayStickersSelection,
  setRecipientId,
  setDisplaySignin,
}) {
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const [data, setData] = useState([]);
  const [readList, setReadList] = useState();
  const [isloading, setIsLoading] = useState(true);
  const rating = [0, 1, 2, 3, 4];

  const { id } = useParams();

  useEffect(() => {
    const Datas = async () => {
      try {
        if (storiesRead) {
          const readBooks = JSON.parse(storiesRead);
          setReadList(readBooks);
        }
        const { data } = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("writer>>>", data);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    Datas();
  }, []);
  return (
    <main>
      {isloading && <>En cours de chargement</>}
      {alert && <AlertDisplay warning={warning} />}
      {!isloading && (
        <div className="writer-page">
          <div className="banner">
            {data.banner ? (
              <img src={data.banner} alt="couverture" />
            ) : (
              <img src={banner} alt="couverture" />
            )}
            <div className="name">
              <div className="wattpad-name">
                <div>@{data.writer_details.username}</div>
              </div>
              <div className="discord-name">
                <img className="min-logo" src={logodiscord} alt="Discord" />
                <div>{data.writer_details.discord}</div>
              </div>
            </div>
          </div>
          {/* Fin de la couverture de page */}
          {/* début du bloc 1 */}
          <section className="section1">
            {/* Colonne de gauche */}
            <div className="column1">
              <div className="social-networks">
                <div>
                  <a href={data.writer_details.wattpad} target="_blank">
                    <img
                      src={logowattpad}
                      className="network-picto"
                      alt="Wattpad"
                    />
                  </a>
                </div>
                {data.writer_details.facebook && (
                  <div>
                    <a href={data.writer_details.facebook} target="_blank">
                      <img
                        src={logofacebook}
                        className="network-picto"
                        alt="Facebook"
                      />
                    </a>
                  </div>
                )}
                {data.writer_details.instagram && (
                  <div>
                    <a href={data.writer_details.instagram} target="_blank">
                      <img
                        src={logoinstagram}
                        className="network-picto"
                        alt="Instagram"
                      />
                    </a>
                  </div>
                )}
              </div>
              <div className="writer-details">
                <div>
                  <strong>Role :</strong> {data.writer_details.role}
                </div>
                <div>
                  <strong>Date de naissance :</strong>{" "}
                  <DisplayDate date={data.writer_details.birthdate} />
                </div>
                <div>
                  <strong>Présentation :</strong>{" "}
                  {data.writer_details.description}
                </div>
              </div>
            </div>
            {/* début de la colonne de gauche de la section 1 */}
            <div className="column2">
              <div className="line1">
                <div>
                  <button
                    onClick={() => {
                      if (token) {
                        setRecipientId(data._id);
                        setDisplayStickersSelection(true);
                      } else {
                        setDisplaySignin(true);
                      }
                    }}
                  >
                    Envoyer un sticker
                  </button>
                </div>
                <div>
                  Dernière connexion :
                  <DisplayDate date={data.connexion_details.last_connexion} />
                </div>
              </div>
              <div className="line2">
                <h3>
                  Histoires écrites par{" "}
                  <span className="username">
                    {data.writer_details.username}
                  </span>{" "}
                  :
                </h3>

                <div className="writtenStories">
                  {data.stories_written.map((book, index) => {
                    console.log("Boook", book);
                    let half = false;
                    if (
                      book.book_written.note -
                        Math.floor(book.book_written.note) >
                      0
                    ) {
                      half = true;
                    }
                    let isAlreadyRead = false;
                    if (readList) {
                      for (let s = 0; s < readList.length; s++) {
                        if (readList[s].book_read === book.book_written._id) {
                          isAlreadyRead = true;
                        }
                      }
                    }
                    return (
                      <div key={index}>
                        <div className="storyDetails">
                          <div style={{ position: "relative" }}>
                            {isAlreadyRead && (
                              <FontAwesomeIcon
                                className="bookmark"
                                icon="bookmark"
                                size="xl"
                                color="white"
                              />
                            )}
                            <BookImg
                              className="cover"
                              story_cover={
                                book.book_written.story_details.story_cover
                              }
                              story_title={
                                book.book_written.story_details.story_title
                              }
                              story_url={
                                book.book_written.story_details.story_url
                              }
                              story_id={book.book_written._id}
                              size={150}
                            />
                          </div>
                          <div className="storyDetails_right">
                            <h3>
                              {book.book_written.story_details.story_title}
                            </h3>
                            <div>
                              <strong>
                                {book.book_written.story_details.story_cat}
                              </strong>{" "}
                              --{" "}
                              {book.book_written.story_details.story_mature
                                ? "Mature"
                                : "Tout public"}{" "}
                              -- {book.book_written.views} vues
                              {book.book_written.statusForConcours ===
                                "Active" && (
                                <div>
                                  🏆 Histoire inscrite au concours actuel
                                </div>
                              )}
                              {book.book_written.isRegistered === "Yes" && (
                                <div>
                                  🖋️Histoire inscrite pour le prochain échange
                                  d'avis
                                </div>
                              )}
                            </div>
                            {book.book_written.note > 0 && (
                              <div className="rate">
                                {rating.map((rate, index) => {
                                  if (
                                    rate < Math.floor(book.book_written.note)
                                  ) {
                                    return (
                                      <FontAwesomeIcon
                                        key={index}
                                        icon="star"
                                      />
                                    );
                                  } else if (
                                    rate ===
                                      Math.floor(book.book_written.note) &&
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
                                <span className="note">
                                  {book.book_written.note}/5
                                </span>
                              </div>
                            )}
                            {book.book_written.concours.length > 0 && (
                              <div>
                                <strong>Classement au concours</strong>
                                <div className="concours-results">
                                  {book.book_written.concours.map(
                                    (concours, index) => {
                                      return (
                                        <div key={index}>
                                          <strong>
                                            {concours.session_name} :
                                          </strong>
                                          #{concours.rank}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                            <div>
                              {book.book_written.story_details.story_description.slice(
                                0,
                                200
                              )}
                              {book.book_written.story_details.story_description.slice(
                                201
                              ) && "..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          {data.public_progress && data.target_progress > 0 && (
            <section className="section2">
              <h3>Progression</h3>
              <Progression
                progress={data.progress}
                target={data.target_progress}
              />
            </section>
          )}
          <section className="section3">
            <h3>Histoires lues</h3>
            {data.stories_read && (
              <div className="stories-read">
                {data.stories_read.map((story, index) => {
                  let isAlreadyRead = false;
                  if (readList) {
                    for (let s = 0; s < readList.length; s++) {
                      if (readList[s].book_read === story.book_read._id) {
                        isAlreadyRead = true;
                      }
                    }
                  }
                  return (
                    <div style={{ position: "relative" }}>
                      {isAlreadyRead && (
                        <FontAwesomeIcon
                          className="bookmark"
                          icon="bookmark"
                          size="xl"
                          color="white"
                        />
                      )}{" "}
                      <BookImg
                        key={index}
                        className="cover"
                        story_cover={story.book_read.story_details.story_cover}
                        story_title={story.book_read.story_details.story_title}
                        story_url={story.book_read.story_details.story_url}
                        story_id={story.book_read._id}
                        size={150}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
