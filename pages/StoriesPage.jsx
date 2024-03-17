import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Story from "../components/Story";
import("../src/assets/storiespage.css");
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import BookImg from "../components/BookImg";
import logowattpad from "../src/assets/wattpad_min.png";
import logodiscord from "../src/assets/discord_min.png";
import logofacebook from "../src/assets/facebook.png";
import logoinstagram from "../src/assets/instagram.webp";
export default function StoriesPage({ storiesRead }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [readList, setReadList] = useState(null);
  const [stories, setStories] = useState([]);
  const [count, setCount] = useState(0);
  const [bookId, setBookId] = useState(null);
  const [more, setMore] = useState(1);
  const [mature, setMature] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState(0);
  const [booksList, setBooksList] = useState([]);
  const rating = [0, 1, 2, 3, 4];

  useEffect(() => {
    const Datas = async () => {
      try {
        if (storiesRead) {
          const readBooks = JSON.parse(storiesRead);
          setReadList(readBooks);
        }
        let request = `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/books?sort=last_added&limit=15&more=${more}&note=${note}`;
        if (bookId) {
          request = request + `&id=${bookId}`;
        }
        if (mature) {
          request = request + `&mature=no`;
        }
        if (category) {
          request = request + `&category=${category}`;
        }
        const { data } = await axios.get(request);
        setStories(data.results);
        console.log(data.results);
        setCount(data.count);
        const newBooksList = [];
        for (let b = 0; b < data.booksList.length; b++) {
          newBooksList.push({
            id: data.booksList[b]._id,
            name: data.booksList[b].story_details.story_title,
          });
        }
        setBooksList(newBooksList);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    Datas();
  }, [search]);

  const handleOnSelect = (item) => {
    setBookId(item.id);
    setSearch(!search);
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  return (
    <main className="storiesPage">
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
        <div>
          <section className="filter">
            <div>
              {booksList.length > 0 && (
                <ReactSearchAutocomplete
                  items={booksList}
                  onSelect={handleOnSelect}
                  autoFocus
                  formatResult={formatResult}
                />
              )}
            </div>
            <div className="mature">
              Histoires avec du contenu mature ?{" "}
              {!mature ? (
                <input
                  type="checkbox"
                  checked
                  onChange={() => {
                    setMature("no");
                    setSearch(!search);
                  }}
                />
              ) : (
                <input
                  type="checkbox"
                  onChange={() => {
                    setMature("");
                    setSearch(!search);
                  }}
                />
              )}
            </div>
            <div className="category-filter">
              <label>
                Catégorie :{" "}
                <select
                  id="category"
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setSearch(!search);
                  }}
                >
                  <option value="">Catégories</option>
                  <option value="Imaginaire">Imaginaire</option>
                  <option value="Romance">Romance</option>
                  <option value="Autre">Autre</option>
                </select>
              </label>
            </div>
            <div className="note-filter">
              <h4>note minimale:</h4>
              <div className="note">
                <label>
                  0 :
                  <input
                    type="radio"
                    name="rate"
                    value={0}
                    onChange={() => {
                      setNote(0);
                      setSearch(!search);
                    }}
                  />
                </label>
                <label>
                  1 :
                  <input
                    type="radio"
                    name="rate"
                    value={1}
                    onChange={() => {
                      setNote(1);
                      setSearch(!search);
                    }}
                  />
                </label>
                <label>
                  2 :
                  <input
                    type="radio"
                    name="rate"
                    value={2}
                    onChange={() => {
                      setNote(2);
                      setSearch(!search);
                    }}
                  />
                </label>
                <label>
                  3 :
                  <input
                    type="radio"
                    name="rate"
                    value={3}
                    onChange={() => {
                      setNote(3);
                      setSearch(!search);
                    }}
                  />
                </label>
                <label>
                  4 :
                  <input
                    type="radio"
                    name="rate"
                    value={4}
                    onChange={() => {
                      setNote(4);
                      setSearch(!search);
                    }}
                  />
                </label>
                <label>
                  5 :
                  <input
                    type="radio"
                    name="rate"
                    value={5}
                    onChange={() => {
                      setNote(5);
                      setSearch(!search);
                    }}
                  />
                </label>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setMature("");
                  setMore(1);
                  setCategory("");
                  setNote(0);
                  setBookId(null);
                  setSearch(!search);
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          </section>
          <section>
            <div className="writtenStories">
              {stories.map((book, index) => {
                let half = false;
                if (book.note - Math.floor(book.note) > 0) {
                  half = true;
                }
                let isAlreadyRead = false;
                if (readList) {
                  for (let s = 0; s < readList.length; s++) {
                    if (readList[s].book_read === book._id) {
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
                          story_cover={book.story_details.story_cover}
                          story_title={book.story_details.story_title}
                          story_url={book.story_details.story_url}
                          story_id={book._id}
                          size={200}
                        />
                      </div>
                      <div className="storyDetails_right">
                        <h3>{book.story_details.story_title}</h3>
                        <div>
                          <h4>{book.story_details.story_cat}</h4> --{" "}
                          {book.story_details.story_mature
                            ? "Mature"
                            : "Tout public"}{" "}
                          -- {book.views} vues
                          {book.statusForConcours === "Active" && (
                            <div>🏆 Histoire inscrite au concours actuel</div>
                          )}
                          {book.isRegistered === "Yes" && (
                            <div>
                              🖋️Histoire inscrite pour le prochain échange
                              d'avis
                            </div>
                          )}
                        </div>
                        {book.note > 0 && (
                          <div className="rate">
                            {rating.map((rate, index) => {
                              if (rate < Math.floor(book.note)) {
                                return (
                                  <FontAwesomeIcon key={index} icon="star" />
                                );
                              } else if (
                                rate === Math.floor(book.note) &&
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
                            <span className="note">{book.note}/5</span>
                          </div>
                        )}
                        {book.concours.length > 0 && (
                          <div>
                            <strong>Classement au concours</strong>
                            <div className="concours-results">
                              {book.concours.map((concours, index) => {
                                return (
                                  <div key={index}>
                                    <strong>{concours.session_name} :</strong>#
                                    {concours.rank}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <div>
                          {book.story_details.story_description.slice(0, 268)}
                          {book.story_details.story_description.slice(269) &&
                            "..."}
                        </div>
                      </div>
                      <div className="writerDetails">
                        <h4>À propos de l'auteur</h4>
                        <div>
                          Auteur :{" "}
                          <Link to={`/writer/${book.writer._id}`}>
                            <strong>
                              {book.writer.writer_details.username}
                            </strong>
                          </Link>
                        </div>
                        {book.writer.writer_details.discord && (
                          <div className="discord">
                            <img
                              className="pictos-networks"
                              src={logodiscord}
                              alt="Discord"
                            />{" "}
                            {book.writer.writer_details.discord}
                          </div>
                        )}
                        <div className="socialLinks">
                          {book.writer.writer_details.facebook && (
                            <a
                              href={book.writer.writer_details.facebook}
                              target="_blank"
                            >
                              <img
                                className="pictos-networks"
                                src={logofacebook}
                                alt="Facebook"
                              />
                            </a>
                          )}
                          {book.writer.writer_details.instagram && (
                            <a
                              href={book.writer.writer_details.instagram}
                              target="_blank"
                            >
                              <img
                                className="pictos-networks"
                                src={logoinstagram}
                                alt="Instagram"
                              />
                            </a>
                          )}
                          {book.writer.writer_details.wattpad && (
                            <a
                              href={book.writer.writer_details.wattpad}
                              target="_blank"
                            >
                              <img
                                className="pictos-networks"
                                src={logowattpad}
                                alt="Wattpad"
                              />
                            </a>
                          )}
                        </div>
                        {book.writer.stories_written.length > 1 ? (
                          <div>
                            {book.writer.stories_written.length} histoires
                          </div>
                        ) : (
                          <div>1 histoire</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="btn-more">
            {more * 15 < count && (
              <button
                onClick={() => {
                  setMore(more + 1);
                  setSearch(!search);
                }}
              >
                Plus d'histoires
              </button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
