import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import("../src/assets/adminpage.css");
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertDisplay from "../components/Alert";
import BookImg from "../components/BookImg";
import GetReview from "../components/GetReview";

export default function AdminPage({ token, isAdmin }) {
  const [data, setData] = useState([]);
  const [authors, setAuthors] = useState(null);
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState(false);
  const [change, setChange] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [week, setWeek] = useState(null);
  const [careful, setCareful] = useState(false);
  const [nbAuthors, setNbAuthors] = useState(0);
  useEffect(() => {
    try {
      const Datas = async () => {
        const { data } = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/datas`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setData(data);
        if (data[7].concours) {
          if (data[7].concours.weeks) {
            setWeek(data[7].concours.weeks[data[7].concours.weeks.length - 1]);
          }
        }
        console.log(data[1].pendingWriters);
      };
      Datas();
      const getAuthors = async () => {
        try {
          const { data } = await axios.get(
            "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/authors",
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          let count = 0;
          for (let a = 0; a < data.authors.length; a++) {
            if (data.authors[a].status === "Registered") {
              count++;
            }
            setNbAuthors(count);
          }
          setAuthors(data);
        } catch (error) {
          console.log(error.message);
        }
      };
      getAuthors();
      setIsloading(false);
    } catch (error) {
      console.log(error.message);
      setIsloading(false);
    }
  }, [change]);

  const updateWriter = async (id, req) => {
    try {
      setIsloading(true);
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/writer/${id}`,
        req,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("La modification a bien été effectuée");
      setChange(!change);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateBook = async (id, req) => {
    try {
      setIsloading(true);
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/book/${id}`,
        req,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("La modification a bien été effectuée");
      setChange(!change);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const newWeek = async () => {
    try {
      const didntVote = [];
      if (!careful) {
        for (let a = 0; a < authors.authors.length; a++) {
          if (authors.authors[a].status === "Active") {
            if (authors.authors[a].stories_voted.length < week) {
              didntVote.push(authors.authors[a].account.username);
            }
          }
        }
        if (didntVote.length > 0) {
          setWarning(
            "Des participants n'ont pas encore voté. Es-tu sûre que la semaine est bien finie ? Si oui, reclique sur le bouton."
          );
          setAlert(true);
          setTimeout(() => {
            setAlert(false);
          }, 3000);
          setCareful(true);
        }
      }
      if (careful || didntVote.length === 0) {
        const { data1 } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/week`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (week === (authors.nbActive - 1) / 2) {
          const { data2 } = await axios.post(
            `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/endSession`,
            {},
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          setWeek(0);
          setCareful(false);
          setWarning("La session est terminée.");
          setAlert(true);
          setChange(!change);
          setTimeout(() => {
            setAlert(false);
          }, 3000);
        } else {
          setWeek(week + 1);
          setCareful(false);
          setWarning("La semaine a bien été mise à jour.");
          setAlert(true);
          setChange(!change);
          setTimeout(() => {
            setAlert(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const newSessionConcours = async () => {
    try {
      if (authors.nbRegistered % 2 === 0) {
        setWarning("Le nombre de participants enregistrés doit être impair.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else if (week > 0) {
        setWarning("Une session est déjà en cours !");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsloading(true);
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/newSession/`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setWarning("La session de concours a bien été lancée !");
        setAlert(true);
        setIsloading(false);
        setChange(!change);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
      setIsloading(false);
      setWarning("Une erreur s'est produite.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  const newExchange = async () => {
    try {
      setIsloading(true);
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/exchange/new`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("L'échange a bien été lancé");
      setChange(!change);
      setIsloading(false);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error.message);
      setIsloading(false);
      setWarning("Une erreur s'est produite.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  const completeExchange = async () => {
    try {
      setIsloading(true);
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/exchange/complete`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("L'échange a bien été cloturé");
      setChange(!change);
      setAlert(true);
      setIsloading(false);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error.message);
      setIsloading(false);
      setWarning("Une erreur s'est produite.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/changeStatus/${id}`,
        { status: status },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("Le statut a bien été mis à jour.");
      setChange(!change);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } catch (error) {
      console.log(error.message);
      setWarning("Une erreur s'est produite.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  return !isAdmin ? (
    <Navigate to="/" />
  ) : isloading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Loading isLoading={isloading} />
    </div>
  ) : (
    <main className="adminpage">
      {alert && <AlertDisplay warning={warning} />}
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Espace administrateur
      </h1>
      <div className="bloc1">
        <div className="left-col">
          <div>
            <h3>Concours</h3>
            {week && (
              <h4>
                {data[7].concours.name} -- Semaine {week}
              </h4>
            )}
            {week ? (
              <button
                onClick={() => {
                  newWeek();
                }}
              >
                Démarrer une nouvelle semaine
              </button>
            ) : (
              <button
                onClick={() => {
                  newSessionConcours();
                }}
              >
                Lancer une nouvelle session
              </button>
            )}
          </div>
          <div>
            <h3>Échanges</h3>
            {data[6] && data[6].echange && data[6].echange.length > 0 ? (
              <button
                onClick={() => {
                  completeExchange();
                }}
              >
                Terminer la session d'échange
              </button>
            ) : (
              <button
                onClick={() => {
                  newExchange();
                }}
              >
                Commencer la session d'échange
              </button>
            )}
          </div>
        </div>
        <div className="right-col">
          {/* ------------ Nouveaux auteurs à valider ------------ */}
          <div style={{ position: "relative" }}>
            <h3>Auteurs à valider</h3>
            <p className="explication">
              Vérifier que l'adresse wattpad renvoie bien au compte de l'auteur.
            </p>
            <div className="containers">
              {data &&
                data[1] &&
                data[1].countPendingWriters > 0 &&
                data[1].pendingWriters.map((writer, index) => {
                  return (
                    <div key={index} className="writer">
                      <a href={writer.writer_details.wattpad} target="_blank">
                        {writer.writer_details.username}
                      </a>
                      <div>
                        {" "}
                        <FontAwesomeIcon
                          icon="check"
                          size="xl"
                          onClick={() => {
                            updateWriter(writer._id, { status: "Active" });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              {data && data[1] && data[1].countPendingWriters === 0 && (
                <div>Aucun nouvel auteur enregistré</div>
              )}
            </div>
          </div>
          {/* ------------ Discord non vérifiés ------------ */}
          <div style={{ position: "relative" }}>
            <h3>Discord à vérifier</h3>
            <p className="explication">
              Vérifier que l'adresse wattpad renvoie bien au compte de l'auteur.
            </p>
            <div className="containers">
              {data &&
                data[0] &&
                data[0].countDiscordUnchecked > 0 &&
                data[0].discordUnchecked.map((writer, index) => {
                  console.log(writer);
                  return (
                    writer.writer_details.discord && (
                      <div key={index} className="writer">
                        <a href={writer.writer_details.wattpad} target="_blank">
                          {writer.writer_details.discord}
                        </a>

                        <div>
                          {" "}
                          <FontAwesomeIcon
                            icon="check"
                            size="xl"
                            onClick={() => {
                              updateWriter(writer._id, {
                                discord_checked: true,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )
                  );
                })}
              {data && data[0] && data[0].countDiscordUnchecked === 0 && (
                <div>Aucun nouvel compte discord à vérifier</div>
              )}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <h3>Histoires à valider</h3>
            <p className="explication">
              Vérifier que l'adresse wattpad renvoie bien à une histoire qui a
              été écrite par cet auteur.
            </p>
            <div className="containers">
              {data &&
                data[2] &&
                data[2].count > 0 &&
                data[2].books.map((book, index) => {
                  return (
                    <div key={index} className="book">
                      <div>
                        {book.writer.writer_details.username.slice(0, 12)}
                        {book.writer.writer_details.username.slice(12) && "..."}
                      </div>
                      <BookImg
                        story_cover={book.story_details.story_cover}
                        story_title={book.story_details.story_title}
                        story_url={book.story_details.story_url}
                        story_id={book.story_details.story_id}
                        size={150}
                      />
                      <div>
                        <FontAwesomeIcon
                          icon="check"
                          size="xl"
                          onClick={() => {
                            updateBook(book._id, {
                              isChecked: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              {data && data[2] && data[2].count === 0 && (
                <div>Aucune nouvelle histoire à valider</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bloc2">
        <h3>Contestations à gérer :</h3>
        <div>
          {data &&
            data[3] &&
            data[3].count > 0 &&
            data[3].contestations.map((contestation, index) => {
              console.log(contestation);
              return (
                <div key={index}>
                  <GetReview
                    token={token}
                    id={contestation.story_review}
                    contestation={contestation}
                    setWarning={setWarning}
                    setAlert={setAlert}
                    setChange={setChange}
                    change={change}
                  />
                </div>
              );
            })}
          {data && data[3] && data[3].count === 0 && (
            <div>Aucune contestation à gérer</div>
          )}
        </div>
      </div>
      <div className="bloc2">
        <h3>Inscriptions en attente pour le concours :</h3>
        <div className="bookContainer">
          {authors &&
            authors.authors.map((author, index) => {
              return (
                author.status === "Pending" && (
                  <div key={index} className="book2">
                    <div className="writer2">{author.account.username}</div>
                    <BookImg
                      story_cover={author.story_details.story_cover}
                      story_title={author.story_details.story_title}
                      story_url={author.story_details.story_url}
                      size={150}
                    />
                    <div className="icons">
                      <FontAwesomeIcon
                        className="icon to-validate"
                        icon="check"
                        size="xl"
                        onClick={() => {
                          changeStatus(author._id, "Registered");
                        }}
                      />
                      <FontAwesomeIcon
                        className="icon to-inactive"
                        icon="pause"
                        size="xl"
                        onClick={() => {
                          changeStatus(author._id, "Inactive");
                        }}
                      />
                      <FontAwesomeIcon
                        className="icon to-dissmiss"
                        icon="xmark"
                        size="xl"
                        onClick={() => {
                          changeStatus(author._id, "Dissmissed");
                        }}
                      />
                    </div>
                  </div>
                )
              );
            })}
        </div>
      </div>
      <div className="bloc2">
        <h3>
          Inscriptions validées pour le concours : {nbAuthors} participants
          validés
        </h3>
        <div className="bookContainer">
          {authors &&
            authors.authors.map((author, index) => {
              return (
                author.status === "Registered" && (
                  <div
                    key={index}
                    className="book2"
                    style={{ height: "200px" }}
                  >
                    <div className="writer2">{author.account.username}</div>
                    <BookImg
                      story_cover={author.story_details.story_cover}
                      story_title={author.story_details.story_title}
                      story_url={author.story_details.story_url}
                      size={150}
                    />
                  </div>
                )
              );
            })}
        </div>
      </div>
      <div className="bloc2">
        <h3>
          Inscrits pour le prochain échange d'avis :{" "}
          {data && data[8] && data[8].count > 0 ? data[8].count : "0 "}{" "}
          participants
        </h3>
        <div className="bookContainer">
          {data &&
            data[8] &&
            data[8].count > 0 &&
            data[8].writersRegistered.map((book, index) => {
              return (
                <div
                  key={index}
                  className="book2"
                  style={{ height: "220px", textAlign: "center" }}
                >
                  <Link className="writer2">
                    <div>{book.writer.writer_details.username}</div>
                    {book.writer.writer_details.discord && (
                      <div>({book.writer.writer_details.discord})</div>
                    )}
                  </Link>
                  <div>{book.story_details.story_cat}</div>
                  <BookImg
                    story_cover={book.story_details.story_cover}
                    story_title={book.story_details.story_title}
                    story_url={book.story_details.story_url}
                    story_id={book._id}
                    size={120}
                  />
                </div>
              );
            })}
          {data && data[8] && data[8].count === 0 && (
            <div>Aucun inscrit pour l'échange d'avis</div>
          )}
        </div>
      </div>
      <div className="bloc2">
        <h3>
          Résultats du tirage d'échanges d'avis :{" "}
          {data[6] && data[6].echange[0]
            ? data[6].echange[0].draw.length
            : "0 "}
          participants
        </h3>
        <div className="bookContainerWrap">
          {data &&
            data[6] &&
            data[6].echange &&
            data[6].echange[0] &&
            data[6].echange[0].draw.map((book, index) => {
              console.log("BOOK", book);
              return (
                <div key={index} className="exchange-datas">
                  <div>
                    <div>Catégorie : {book.book.story_details.story_cat}</div>
                    <div>
                      Lecteur :{" "}
                      <Link className="writer2">
                        {book.reviewer.writer_details.username.slice(0, 15)}{" "}
                        {book.reviewer.writer_details.username.slice(16) &&
                          "..."}
                        {book.reviewer.writer_details.discord &&
                          ` - (${book.reviewer.writer_details.discord.slice(
                            0,
                            15
                          )}${
                            book.reviewer.writer_details.discord.slice(16) &&
                            "..."
                          })`}
                      </Link>
                    </div>
                    <div>
                      Auteur :{" "}
                      <Link className="writer2">
                        {book.writer.writer_details.username.slice(0, 15)}{" "}
                        {book.writer.writer_details.username.slice(16) && "..."}
                        {book.writer.writer_details.discord &&
                          ` - (${book.writer.writer_details.discord.slice(
                            0,
                            15
                          )}${
                            book.writer.writer_details.discord.slice(16) &&
                            "..."
                          })`}
                      </Link>
                    </div>
                    <div>
                      Avis :{" "}
                      {book.review &&
                        (book.review.status === "sent"
                          ? "Envoyé à l'auteur"
                          : book.review.status === "approuved"
                          ? "Validé par l'auteur"
                          : book.review.status === "contested"
                          ? "Contesté par l'auteur"
                          : book.review.status === "null" &&
                            "Annulé par un admin")}
                      {!book.review && "Pas encore envoyé"}
                    </div>
                  </div>
                  <BookImg
                    story_cover={book.book.story_details.story_cover}
                    story_title={book.book.story_details.story_title}
                    story_url={book.book.story_details.story_url}
                    story_id={book.book._id}
                    size={120}
                  />
                </div>
              );
            })}
          {data && !data[6] && <div>Aucun échange en cours</div>}
        </div>
      </div>
    </main>
  );
}
