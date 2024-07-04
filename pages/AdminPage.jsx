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
  const [displayStickers, setDisplayStickers] = useState(false);
  const messagesList = [
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/wine_qphgtq.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/typing_fsoncc.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/tired-sleep_ud0nnn.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/thanks_cvl5nn.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/search_swa11z.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/sad_boybdk.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/penguin-ganbatte_lr9kbf.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/miss-you_rwokmy.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/mad-angry_nbbbo5.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/kisses_d3p7ym.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/luck_sbj71c.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/hello_dxk6rc.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/dream-it-do-it_dwzxql.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/coffee_cfar5r.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/clap_dqgpor.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/cat-computer_xrwklq.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/angry-typing_o3p993.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/birthday_s0oxux.gif",
  ];
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
      };
      Datas();
      console.log("DATA", data);
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

  const sendSticker = async (message) => {
    try {
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/sendMessage`,
        message,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("Le sticker a bien été envoyé à tous les auteurs actifs !");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        setDisplayStickers(false);
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
    <main className="adminpage fixedWidth">
      {alert && <AlertDisplay warning={warning} />}
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Espace administrateur
      </h1>
      <div></div>

      {/* Début espace administrateur */}
      <div className="send-stickers">
        <img
          src={
            "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/hello_dxk6rc.gif"
          }
          alt="sticker"
        />
        <button
          onClick={() => {
            setDisplayStickers(!displayStickers);
          }}
        >
          Envoyer un sticker à tous les auteurs
        </button>
        <br />
        {displayStickers && (
          <div className="stickers">
            {messagesList.map((message, index) => {
              return (
                <img
                  key={index}
                  src={message}
                  alt="sticker"
                  onClick={() => {
                    sendSticker({ message: message });
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      <section className="section">
        <h2>Section gérée par Laura</h2>
        <h3>👋 Nouveaux inscrits</h3>
        <div>
          <p>
            Vérifier que les pseudo des nouveaux inscrits renvoient bien vers un
            vrai compte (en cliquant dessus) et valider. Sinon, supprimer.
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
                    <div className="check yes">
                      {" "}
                      <FontAwesomeIcon
                        icon="check"
                        size="xl"
                        onClick={() => {
                          updateWriter(writer._id, { status: "Active" });
                        }}
                      />
                    </div>
                    <div className="check no">
                      <FontAwesomeIcon
                        className="icon to-dissmiss"
                        icon="xmark"
                        size="xl"
                        onClick={() => {
                          setWarning("Fonctionnalité en cours de création");
                          setAlert(true);
                          setTimeout(() => {
                            setAlert(false);
                            setDisplayStickers(false);
                          }, 3000);
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

        <h3>👥 Comptes Discord</h3>
        <div>
          <p>
            Vérifier que le pseudo affiché est bien présent sur le discord. Si
            oui, valider et attribuer le rang "scribe confirmé" sur le serveur.
            Si non, contacter par email. Si pas de réponse au bout de deux
            semaines, supprimer.
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
                      <div>
                        <a href={writer.writer_details.wattpad} target="_blank">
                          {writer.writer_details.discord}
                        </a>
                        <div className="check yes">
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
                        <div className="check no">
                          <FontAwesomeIcon
                            className="icon to-dissmiss"
                            icon="xmark"
                            size="xl"
                            onClick={() => {
                              setWarning("Fonctionnalité en cours de création");
                              setAlert(true);
                              setTimeout(() => {
                                setAlert(false);
                                setDisplayStickers(false);
                              }, 3000);
                            }}
                          />
                        </div>
                      </div>
                      {writer.connexion_details.email}
                    </div>
                  )
                );
              })}
            {data && data[0] && data[0].countDiscordUnchecked === 0 && (
              <div>Aucun nouvel compte discord à vérifier</div>
            )}
          </div>
        </div>

        <h3>📚 Nouvelles histoires</h3>
        <div>
          <p>
            Vérifier que l'image renvoie bien vers une histoire Wattpad écrite
            par cet auteur. Sinon, supprimer.
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
                      <div className="check yes">
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
                      <div className="check no">
                        <FontAwesomeIcon
                          className="icon to-dissmiss"
                          icon="xmark"
                          size="xl"
                          onClick={() => {
                            updateBook(book._id, {
                              noDiscord: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            {data && data[2] && data[2].count === 0 && (
              <div>Aucune nouvelle histoire à valider</div>
            )}
          </div>
        </div>
      </section>
      <br />
      <br />

      <section>
        <h2>Section gérée par Poppy</h2>
        <h3>
          🧮 Nombre d'inscrits à la prochaine session : [{" "}
          {authors && authors.nbRegistered} ] /15
        </h3>
        <h3>📋 Inscriptions en attente pour la prochaine session</h3>
        <div className="containers">
          {authors &&
            authors.authors.map((author, index) => {
              return (
                author.status === "Pending" && (
                  <div key={index} className="book2">
                    <div className="writer2">{author.username}</div>
                    <BookImg
                      story_cover={author.story_cover}
                      story_title={author.story_title}
                      story_url={author.story_url}
                      size={150}
                    />
                    <div className="icons">
                      <FontAwesomeIcon
                        className="check yes icon to-validate"
                        icon="check"
                        size="xl"
                        onClick={() => {
                          changeStatus(author._id, "Registered");
                        }}
                      />
                      <FontAwesomeIcon
                        className="check no icon to-dissmiss"
                        icon="xmark"
                        size="xl"
                        onClick={() => {
                          changeStatus(author._id, "Inactive");
                        }}
                      />
                    </div>
                  </div>
                )
              );
            })}
          {authors && authors.nbPending === 0 && (
            <p>Aucune inscription en attente</p>
          )}
        </div>
        <h3>🏆 Gestion de la session en cours</h3>
        <div className="concours">
          {week ? (
            <h4>
              {data[7].concours.name} -- Semaine {week}
            </h4>
          ) : (
            <h4>Aucune session en cours</h4>
          )}
          {week ? (
            week < 7 ? (
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
                  newWeek();
                }}
              >
                Terminer le concours
              </button>
            )
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
        <div className="concours">
          <div>
            <h4>Participants qui n'ont pas encore voté</h4>
            <ul>
              {authors &&
                authors.authors.map((author, index) => {
                  return (
                    author.status === "Active" &&
                    author.stories_voted.length < week && (
                      <li key={index}>
                        {author.writerData.writer_details.discord}
                      </li>
                    )
                  );
                })}
            </ul>
          </div>
          <div>
            <h4>Comptes Instagram des participants</h4>
            <div>
              <ul>
                {authors &&
                  (week
                    ? authors.authors.map((author, index) => {
                        let instagram = "";
                        if (
                          author.status === "Active" &&
                          author.writerData.writer_details.instagram
                        ) {
                          instagram =
                            author.writerData.writer_details.instagram;
                          instagram = instagram.slice(26).split("/");
                          instagram = instagram[0].split("?");
                          instagram = "@" + instagram[0];
                        }
                        return (
                          author.status === "Active" &&
                          author.writerData.writer_details.instagram && (
                            <li key={index}>
                              {author.story_title} → {instagram}
                            </li>
                          )
                        );
                      })
                    : authors.authors.map((author, index) => {
                        let instagram = "";
                        if (
                          author.status === "Registered" &&
                          author.writerData.writer_details.instagram
                        ) {
                          instagram =
                            author.writerData.writer_details.instagram;
                          instagram = instagram.slice(26).split("/");
                          instagram = instagram[0].split("?");
                          instagram = "@" + instagram[0];
                        }
                        return (
                          author.status === "Registered" &&
                          author.writerData.writer_details.instagram && (
                            <li key={index}>
                              {author.story_title} → {instagram}
                            </li>
                          )
                        );
                      }))}
              </ul>
            </div>
          </div>
        </div>
        {!week && (
          <div>
            <h3>📕📗📘 Livres inscrits au prochain concours 📙📗📘</h3> (Faire
            des captures d'écran pour Instagram)
            <div className="booklist">
              {authors &&
                authors.authors.map((author, index) => {
                  return (
                    author.status === "Registered" && (
                      <BookImg
                        key={index}
                        story_cover={author.story_cover}
                        story_title={author.story_title}
                        story_url={author.story_url}
                        size={150}
                      />
                    )
                  );
                })}
            </div>
          </div>
        )}
      </section>
      <br />
      <br />
      <section>
        <h2>Section gérée par SCBoyer</h2>
        <h3>🪓 Contestations à gérer</h3>
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
        <h3>🎰 Gestion du tirage en cours</h3>
        <div>
          <h4>Participants qui n'ont pas encore envoyé leur avis :</h4>
          <div className="noReviewsList">
            {data &&
              data[6] &&
              data[6].echange &&
              data[6].echange[0] &&
              data[6].echange[0].draw.map((book, index) => {
                return (
                  !book.review && (
                    <div key={index} className="noReview">
                      <div style={{ color: "red" }}>
                        lecteur : @{book.reviewer.writer_details.discord}
                      </div>
                      <div>titre : {book.book.story_details.story_title}</div>
                      <div>auteur : @{book.writer.writer_details.discord}</div>
                    </div>
                  )
                );
              })}
          </div>
        </div>
        <div className="btn-exchange">
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
        <h3>
          📋 Inscrits pour le prochain tirage : [{" "}
          {data && data[8] && data[8].count > 0 ? data[8].count : "0 "} ]
          {" participants"}
        </h3>
        {data && data[8] && data[8].count === 0 && (
          <div>Aucun inscrit pour l'échange d'avis</div>
        )}

        <div className="categoryContainer">
          <h4>Romance</h4>
          {data &&
            data[8] &&
            data[8].count > 0 &&
            data[8].writersRegistered.map((book, index) => {
              return (
                book.story_details.story_cat === "Romance" && (
                  <div
                    key={index}
                    className="book2"
                    style={{ height: "240px", textAlign: "center" }}
                  >
                    <Link className="writer2">
                      {book.writer.writer_details.discord && (
                        <div>
                          {book.writer.writer_details.discord.slice(0, 10)}
                          {book.writer.writer_details.discord.slice(10) &&
                            "..."}
                        </div>
                      )}
                    </Link>
                    <BookImg
                      story_cover={book.story_details.story_cover}
                      story_title={book.story_details.story_title}
                      story_url={book.story_details.story_url}
                      story_id={book._id}
                      size={140}
                    />
                  </div>
                )
              );
            })}
        </div>

        <div className="categoryContainer">
          <h4>Imaginaire</h4>
          {data &&
            data[8] &&
            data[8].count > 0 &&
            data[8].writersRegistered.map((book, index) => {
              return (
                book.story_details.story_cat === "Imaginaire" && (
                  <div
                    key={index}
                    className="book2"
                    style={{ height: "240px", textAlign: "center" }}
                  >
                    <Link className="writer2">
                      {book.writer.writer_details.discord && (
                        <div>
                          {book.writer.writer_details.discord.slice(0, 10)}
                          {book.writer.writer_details.discord.slice(10) &&
                            "..."}
                        </div>
                      )}
                    </Link>
                    <BookImg
                      story_cover={book.story_details.story_cover}
                      story_title={book.story_details.story_title}
                      story_url={book.story_details.story_url}
                      story_id={book._id}
                      size={140}
                    />
                  </div>
                )
              );
            })}
        </div>

        <div className="categoryContainer">
          <h4>Autre</h4>
          {data &&
            data[8] &&
            data[8].count > 0 &&
            data[8].writersRegistered.map((book, index) => {
              return (
                book.story_details.story_cat === "Autre" && (
                  <div
                    key={index}
                    className="book2"
                    style={{ height: "240px", textAlign: "center" }}
                  >
                    <Link className="writer2">
                      {book.writer.writer_details.discord && (
                        <div>
                          {book.writer.writer_details.discord.slice(0, 10)}
                          {book.writer.writer_details.discord.slice(10) &&
                            "..."}
                        </div>
                      )}
                    </Link>
                    <BookImg
                      story_cover={book.story_details.story_cover}
                      story_title={book.story_details.story_title}
                      story_url={book.story_details.story_url}
                      story_id={book._id}
                      size={140}
                    />
                  </div>
                )
              );
            })}
        </div>
      </section>
    </main>
  );
}
