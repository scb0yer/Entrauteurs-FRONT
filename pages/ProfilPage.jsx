import axios from "axios";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useCallback } from "react";
import defaultBanner from "../src/assets/banner.jpg";
import "../src/assets/profilpage.css";
import logowattpad from "../src/assets/wattpad_min.png";
import logodiscord from "../src/assets/discord_min.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Progression from "../components/Progression";
import AlertDisplay from "../components/Alert";
import BookImg from "../components/BookImg";
import DisplayDate from "../functions/displayDate";
import Loading from "../components/Loading";
import StickersReceived from "../components/StickersReceived";

export default function ProfilPage({
  setDisplaySignin,
  setDisplayStoryUpdate,
  storiesRead,
  token,
  setToken,
  setStoriesRead,
  setStoryToUpdate,
  setAdult,
  adult,
  setDisplayReview,
  isInExchange,
  setIsInExchange,
  isAdmin,
  setDisplayContestation,
  setStory_review,
  setIsAdmin,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [week, setWeek] = useState();
  const [readList, setReadList] = useState();
  const [isloading, setIsLoading] = useState(true);
  const [storiesAssigned, setStoriesAssigned] = useState();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [publicReview, setPublicReview] = useState(false);
  const [alreadyValidate, setAlreadyValidate] = useState(false);
  const [mature, setMature] = useState();
  const [facebook, setFacebook] = useState();
  const [instagram, setInstagram] = useState();
  const [wattpad, setWattpad] = useState();
  const [discord, setDiscord] = useState();
  const [description, setDescription] = useState();
  const [target_progress, setTargetProgress] = useState(0);
  const [public_progress, setPublicProgress] = useState(false);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const [change, setChange] = useState(false);
  const [exchange, setExchange] = useState(false);
  const [session, setSession] = useState(false);
  const [newProgress, setNewProgress] = useState();
  const [displayStickersReceived, setDisplayStickersReceived] = useState(false);
  const rating = [0, 1, 2, 3, 4];

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      setBanner(null);
      if (acceptedFiles.length > 1) {
        alert("Tu ne peux pas ajouter qu'une seule photo.");
      } else {
        setPreview(URL.createObjectURL(acceptedFiles[0]));
        setBanner(acceptedFiles[0]);
        setChange(true);
      }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <div>
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderBottom: "1px solid black",
              }}
            />
          ) : data.banner ? (
            <img src={data.banner} alt="couverture" />
          ) : (
            <img src={defaultBanner} alt="couverture" />
          )}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!token) {
      setDisplaySignin(true);
    } else {
      const Datas = async () => {
        try {
          if (storiesRead) {
            const readBooks = JSON.parse(storiesRead);
            setReadList(readBooks);
          }
          const { data } = await axios.get(
            `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          if (data.concours_id) {
            const response = await axios.get(
              "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/author",
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            );
            setWeek(response.data.week);
            setStoriesAssigned(response.data.stories);
            if (
              response.data.author.stories_voted.length >= response.data.week
            ) {
              setAlreadyVoted(true);
            }
          }
          if (data.stories_written) {
            for (let s = 0; s < data.stories_written.length; s++) {
              if (data.stories_written[s].book_written.isRegistered === "Yes") {
                setExchange(true);
              }
            }
          }
          if (data.messages.length > 0) {
            setDisplayStickersReceived(true);
          }
          const today = new Date();
          const year2 = today.getFullYear();
          const month2 = today.getMonth();
          const day2 = today.getUTCDate();
          const minYear = year2 - 18;
          const majeurDate = new Date(minYear, month2, day2);
          const birthdate = new Date(data.writer_details.birthdate);
          if (birthdate < majeurDate) {
            setAdult(true);
          } else {
            setAdult(false);
          }
          const storiesWritten = await axios.get(
            `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/books?writer_id=${data._id}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const newPendingReviews = [];
          for (let s = 0; s < storiesWritten.data.count; s++) {
            if (storiesWritten.data.results[s].story_reviews) {
              for (
                let r = 0;
                r < storiesWritten.data.results[s].story_reviews.length;
                r++
              ) {
                if (
                  storiesWritten.data.results[s].story_reviews[r].story_review
                    .status === "sent"
                ) {
                  newPendingReviews.push(
                    storiesWritten.data.results[s].story_reviews[r].story_review
                  );
                }
              }
            }
          }
          setPendingReviews(newPendingReviews);
          console.log(data);
          setData(data);
          setMature(data.writer_details.mature);
          setFacebook(data.writer_details.facebook);
          setInstagram(data.writer_details.instagram);
          setWattpad(data.writer_details.wattpad);
          setDiscord(data.writer_details.discord);
          setBanner(data.banner);
          setDescription(data.writer_details.description);
          setTargetProgress(data.target_progress);
          setPublicProgress(data.public_progress);
          setIsInExchange(data.isInExchange);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      Datas();
    }
  }, [token]);

  const update = async () => {
    try {
      if (!change) {
        setWarning("Il n'y a aucune information à mettre à jour.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("picture", banner);
        formData.append("facebook", facebook);
        formData.append("instagram", instagram);
        formData.append("discord", discord);
        formData.append("description", description);
        formData.append("public_progress", public_progress);
        formData.append("target_progress", target_progress);
        formData.append("mature", mature);
        console.log(banner);
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/update",
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setWarning("Les informations ont bien été mises à jour");
        setMature(data.writer_details.mature);
        setFacebook(data.writer_details.facebook);
        setInstagram(data.writer_details.instagram);
        setWattpad(data.writer_details.wattpad);
        setDiscord(data.writer_details.discord);
        setBanner(data.banner);
        setDescription(data.writer_details.description);
        setTargetProgress(data.target_progress);
        setIsLoading(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        setChange(false);
      }
    } catch (error) {
      console.log(error.message);
      setWarning("Une erreur s'est produite 😥");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const updateProgress = async (action) => {
    try {
      if (!target_progress) {
        setWarning(
          "Tu dois d'abord te fixer un objectif quotidien avant d'ajouter une nouvelle session d'écriture."
        );
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsLoading(true);
        const response = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/progress/${action}`,
          { count: newProgress },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setNewProgress();
        setWarning(
          "Super ! Ta progression a bien été enregistrée. Continue comme ça !"
        );
        const newData = data;
        newData.progress = response.data.progress;
        setData(newData);
        setIsLoading(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
      setWarning("Une erreur s'est produite.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const registerToSession = async (story_title, story_url, story_cover) => {
    try {
      console.log("enter");
      setIsLoading(true);
      if (!data.concours_id && !session) {
        console.log("nouvel auteur");
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/author/signup",
          { story_title, story_url, story_cover },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        setWarning("Ton inscription a bien été prise en compte");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        setSession(true);
      } else if (!session) {
        console.log("auteur existant");
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/author/update",
          { story_title, story_url, story_cover },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setWarning("Ton inscription a bien été prise en compte");
        setIsLoading(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        setSession(true);
      } else {
        console.log("auteur existant qui vient d'inscrire sont histoire");
        setIsLoading(false);
        setWarning("Ton histoire est déjà enregistrée pour le concours.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log("problème");
      console.log(error.message);
      setWarning("Tu ne peux inscrire qu'une seule histoire par concours.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const registerToExchange = async (book_id, isRegistered) => {
    try {
      setIsLoading(true);
      if (isRegistered === "Yes" || exchange === true) {
        setIsLoading(false);
        setWarning("Tu as déjà une histoire d'enregistrée pour l'échange.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        const isRegistered = "Yes";
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/book/update",
          { book_id, isRegistered },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setExchange(true);
        setWarning("Ton histoire est bien inscrite pour le prochain échange.");
        setIsLoading(false);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
      setWarning("Tu ne peux inscrire qu'une seule histoire par concours.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const vote = async (storyId) => {
    try {
      if (alreadyVoted) {
        setWarning("Tu as déjà voté pour cette semaine.");
        setAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/author/vote/${storyId}/${week}`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setAlreadyVoted(true);
        setWarning("Ton vote a bien été pris en compte.");
        setAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const validateReview = async (storyId) => {
    try {
      setIsLoading(true);
      if (alreadyValidate) {
        setWarning("Tu as déjà validé cet avis.");
        setAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/review/validate`,
          { share: publicReview },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setAlreadyVoted(true);
        setWarning("L'avis a bien été validé");
        setAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
      setWarning("Une erreur s'est produite");
      setAlert(true);
      setIsLoading(false);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  return (
    <div>
      {displayStickersReceived
        ? document.body.classList.add("scroll-lock")
        : document.body.classList.remove("scroll-lock")}
      {alert && <AlertDisplay warning={warning} />}
      {displayStickersReceived && data.messages && (
        <StickersReceived
          setDisplayStickersReceived={setDisplayStickersReceived}
          token={token}
          messages={data.messages}
        />
      )}
      <main className="profil">
        {token && isloading && (
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
        )}
        {token && !isloading && (
          <>
            <div className="banner">
              <MyDropzone className="dropzone" />
              <FontAwesomeIcon icon="image" size="xl" className="picto-img" />
              <div className="name">
                <div className="wattpad-name">
                  <img className="min-logo" src={logowattpad} alt="Wattpad" />
                  <div>@{data.writer_details.username}</div>
                  <div style={{ width: "20px" }}></div>
                </div>
                <div className="discord-name">
                  <img className="min-logo" src={logodiscord} alt="Discord" />
                  <input
                    className="discord-input"
                    type="text"
                    value={discord}
                    placeholder="pseudo Discord"
                    onChange={(event) => {
                      setDiscord(event.target.value);
                      setChange(true);
                    }}
                  />
                  <FontAwesomeIcon
                    tyle={{ width: "20px" }}
                    icon="pen-nib"
                    size="xs"
                  />
                </div>
              </div>
              {isAdmin && (
                <div className="admin">
                  <button
                    onClick={() => {
                      navigate("/admin");
                    }}
                  >
                    Espace Administrateur
                  </button>
                </div>
              )}
            </div>
            <div className="bloc1 column-xs">
              <div className="column1">
                <div className="infos">
                  <h3>Infos</h3>
                  <ul>
                    <li>Nombre de vues du profil : {data.views}</li>
                    <li>Role : {data.writer_details.role}</li>
                    <li>Statut : {data.writer_details.status}</li>
                    <li>
                      Date de naissance :{" "}
                      <DisplayDate date={data.writer_details.birthdate} />
                    </li>
                    <li>
                      <div className="mature">
                        J'accepte de lire des histoires avec du contenu mature ?
                        {adult &&
                          (mature ? (
                            <input
                              type="checkbox"
                              id="matureReader"
                              name="matureReader"
                              checked
                              onChange={() => {
                                setMature(false);
                                setChange(true);
                              }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              id="matureReader"
                              name="matureReader"
                              onChange={() => {
                                setMature(true);
                                setChange(true);
                              }}
                            />
                          ))}
                        {!adult && " Non (réservé aux +18 ans)"}
                        {adult && mature ? "Oui" : "Non"}
                      </div>
                    </li>
                    <li>
                      Lien Facebook :{" "}
                      <input
                        type="text"
                        value={facebook}
                        onChange={(event) => {
                          setFacebook(event.target.value);
                          setChange(true);
                        }}
                      />
                    </li>
                    <li>
                      Lien Instagram :{" "}
                      <input
                        type="text"
                        value={instagram}
                        onChange={(event) => {
                          setInstagram(event.target.value);
                          setChange(true);
                        }}
                      />
                    </li>
                    <li>Lien Wattpad : {wattpad}</li>
                    <li>Email : {data.connexion_details.email}</li>
                  </ul>
                </div>
                <div className="avertissement">
                  <h3>Avertissements reçus</h3>
                  {data.warnings.length === 0 ? (
                    <div>Tu n'as reçu aucun avertissement pour le moment.</div>
                  ) : (
                    <div>
                      Tu as reçu {data.warnings.length} avertissement(s).
                    </div>
                  )}
                  <br />
                  Tu reçois automatiquement des avertissements si tu publies des
                  avis inappropriés ou sans aucune bienveillance lors des
                  échanges d'avis, si tu ne votes pas pour une histoire lors
                  d'un concours, ou si tu contestes un avis qui était pourtant
                  approprié et bienveillant.
                  <br />
                  Au bout de 3 avertissements, ton compte est suspendu.
                  <br />
                  <div className="warning">
                    {data.warnings.map((warning, index) => {
                      return (
                        <div key={index}>
                          {warning.admin} : {warning.warning} ({warning.date})
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3>Histoires lues</h3>
                  <div className="readingList">
                    {data.stories_read.map((book, index) => {
                      return (
                        <BookImg
                          key={index}
                          story_cover={book.book_read.story_details.story_cover}
                          story_title={book.book_read.story_details.story_title}
                          story_url={book.book_read.story_details.story_url}
                          story_id={book.book_read._id}
                          size={150}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="column2">
                <div className="presentation">
                  <h3>Présentation</h3>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setChange(true);
                    }}
                  />
                </div>
                {change && (
                  <p className="change-alert">
                    Tu as fait des modifications sur ton profil. N'oublie pas de
                    les enregistrer avant de quitter la page !
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    margin: "0px",
                    border: "none",
                    height: "50px",
                  }}
                >
                  <button
                    className="btn-save"
                    onClick={() => {
                      update();
                    }}
                  >
                    Enregistrer les modifications
                  </button>{" "}
                  <button
                    className="btn-save"
                    onClick={() => {
                      navigate("/password");
                    }}
                  >
                    Modifier le mot de passe
                  </button>
                </div>
                {isInExchange && (
                  <div>
                    <h3>Histoire tirée pour l'échange d'avis</h3>
                    <p>
                      Tu dois y consacrer deux heures de lecture puis remplir la
                      fiche d'avis.
                    </p>
                    <br />
                    <div className="exchangeStory">
                      <BookImg
                        className="cover"
                        story_cover={
                          data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_cover
                        }
                        story_title={
                          data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_title
                        }
                        story_url={
                          data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_url
                        }
                        story_id={
                          data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned._id
                        }
                        size={200}
                      />
                      <div>
                        <h3>
                          {
                            data.stories_assigned[
                              data.stories_assigned.length - 1
                            ].book_assigned.story_details.story_title
                          }
                        </h3>
                        <div>
                          {
                            data.stories_assigned[
                              data.stories_assigned.length - 1
                            ].book_assigned.story_details.story_cat
                          }{" "}
                          --{" "}
                          {data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_mature
                            ? "Mature"
                            : "Tout public"}{" "}
                        </div>
                        <div>
                          {data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_description.slice(
                            0,
                            200
                          )}
                          {data.stories_assigned[
                            data.stories_assigned.length - 1
                          ].book_assigned.story_details.story_description.slice(
                            201
                          ) && "..."}
                        </div>
                        <button
                          style={{ width: "150px" }}
                          onClick={() => {
                            setDisplayReview(true);
                          }}
                        >
                          Remplir la fiche avis
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {pendingReviews.length > 0 && (
                  <div>
                    <h3>Avis à valider</h3>
                    {pendingReviews.map((review, index) => {
                      return (
                        <div className="review-details" key={index}>
                          <div>
                            <h4>Orthographe</h4>
                            <br />
                            <div>
                              <div>
                                Commentaire :
                                <div>
                                  {review.review_details.orthographe.comment1}
                                </div>
                              </div>
                              <div>
                                {" "}
                                Note : {review.review_details.orthographe.note1}
                                /2
                              </div>
                            </div>
                          </div>
                          <br />
                          <div>
                            <h4>Style</h4>
                            <br />
                            <div>
                              <div>
                                Commentaire :{" "}
                                <div>
                                  {review.review_details.style.comment2}
                                </div>
                              </div>
                              <div>
                                {" "}
                                Note : {review.review_details.style.note2}/2
                              </div>
                            </div>
                          </div>
                          <br />
                          <div>
                            <h4>Cohérence</h4>
                            <br />
                            <div>
                              <div>
                                Commentaire :{" "}
                                <div>
                                  {review.review_details.coherence.comment3}
                                </div>
                              </div>
                              <div>
                                {" "}
                                Note : {review.review_details.coherence.note3}/2
                              </div>
                            </div>
                          </div>
                          <br />
                          <div>
                            <h4>Suspens</h4>
                            <br />
                            <div>
                              <div>
                                Commentaire :{" "}
                                <div>
                                  {review.review_details.suspens.comment4}
                                </div>
                              </div>
                              <div>
                                {" "}
                                Note : {review.review_details.suspens.note4}/2
                              </div>
                            </div>
                          </div>
                          <br />
                          <div>
                            <h4>Dialogues</h4>
                            <br />
                            <div>
                              <div>
                                Commentaire :{" "}
                                <div>
                                  {review.review_details.dialogues.comment5}
                                </div>
                              </div>
                              <div>
                                {" "}
                                Note : {review.review_details.dialogues.note5}/2
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className="global">
                            <p>Note globale : {review.note_global}/5</p>
                            Rendre public l'avis sur le site ?
                            {publicReview ? (
                              <input
                                type="checkbox"
                                id="publicReview"
                                name="publicReview"
                                checked
                                onChange={() => {
                                  setPublicReview(false);
                                }}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                id="publicReview"
                                name="publicReview"
                                onChange={() => {
                                  setPublicReview(true);
                                }}
                              />
                            )}
                            {publicReview ? "oui" : "non"}
                            <button
                              onClick={() => {
                                validateReview(review.book);
                              }}
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => {
                                setStory_review(review._id);
                                setDisplayContestation(true);
                              }}
                            >
                              Contester
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {data.concours_id && data.concours_id.status === "Active" && (
                  <div>
                    <section className="activeSection">
                      <h2>Concours 🏆 --- Semaine {week}</h2>
                      <div className="invisible">
                        <p className="smallText">
                          Tu as jusqu'à samedi soir pour consacrer une heure de
                          lecture à chacune de ces histoires, et voter pour
                          celle que tu préfères.
                        </p>
                        <p className="smallText">
                          Attention, une fois que tu as voté, tu ne peux plus
                          revenir en arrière.
                        </p>
                        <p className="smallText">
                          Si tu ne votes pas, tu auras une pénalité de deux
                          points.
                        </p>
                        <p className="smallText">
                          Quand la semaine sera terminée (dimanche dans la
                          matinée), deux nouvelles histoires apparaitront.
                        </p>
                      </div>
                      <br />
                      <p>
                        Clique sur la couverture du livre pour le lire (sur
                        wattpad).
                      </p>
                      <br />
                      <div className="vote">
                        {storiesAssigned.map((story, index) => {
                          return (
                            <div key={index}>
                              <BookImg
                                story_cover={story.story_cover}
                                story_title={story.story_title}
                                story_url={story.story_url}
                                size={200}
                              />
                              {!alreadyVoted && (
                                <button
                                  onClick={() => {
                                    vote(story.story_id);
                                  }}
                                >
                                  Voter pour {story.story_title.slice(0, 15)}
                                  {story.story_title.slice(16) && "..."}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                )}
                <div className="writtenStories">
                  <div className="addStory">
                    <h3>Histoires écrites</h3>
                    <button
                      onClick={() => {
                        if (data.writer_details.status === "Pending") {
                          setWarning(
                            "Ton compte doit d'abord être validé pour que tu puisses ajouter une histoire. Cela se fait généralement en moins de 24h."
                          );
                          setAlert(true);
                          setTimeout(() => {
                            setAlert(false);
                          }, 3500);
                        } else {
                          setDisplayStoryUpdate(true);
                          setToken(token);
                        }
                      }}
                    >
                      Ajouter une histoire
                    </button>
                  </div>
                  {data.stories_written.map((book, index) => {
                    let half = false;
                    if (
                      book.book_written.note -
                        Math.floor(book.book_written.note) >
                      0
                    ) {
                      half = true;
                    }
                    return (
                      <div key={index}>
                        <div className="storyDetails">
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
                            size={200}
                          />
                          <div className="storyDetails_right">
                            <h3>
                              {book.book_written.story_details.story_title}
                            </h3>
                            {book.book_written.statusForConcours ===
                              "Pending" && (
                              <div>
                                Histoire inscrite au prochain concours :
                                inscription en attente de validation
                              </div>
                            )}
                            {book.book_written.statusForConcours ===
                              "Registered" && (
                              <div>
                                Histoire inscrite au prochain concours :
                                inscription validée
                              </div>
                            )}
                            <div>
                              {book.book_written.story_details.story_cat} --{" "}
                              {book.book_written.story_details.story_mature
                                ? "Mature"
                                : "Tout public"}{" "}
                              {book.book_written.statusForConcours ===
                                "Active" && (
                                <div>Histoire inscrite au concours actuel</div>
                              )}
                              -- {book.book_written.views} vues
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

                            <div>Classement au concours</div>
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
                        <div className="subscription">
                          <button
                            onClick={() => {
                              const storyToUpdate = {
                                story_id: book.book_written._id,
                                story_title:
                                  book.book_written.story_details.story_title,
                                story_url:
                                  book.book_written.story_details.story_url,
                                story_cover:
                                  book.book_written.story_details.story_cover,
                                story_cat:
                                  book.book_written.story_details.story_cat,
                                story_description:
                                  book.book_written.story_details
                                    .story_description,
                                story_mature:
                                  book.book_written.story_details.story_mature,
                              };
                              setStoryToUpdate(storyToUpdate);
                              setDisplayStoryUpdate(true);
                            }}
                          >
                            Modifier
                          </button>
                          {data.concours_id &&
                            data.concours_id.status !== "Active" &&
                            book.book_written.statusForConcours !== "Pending" &&
                            book.book_written.statusForConcours !==
                              "Registered" && (
                              <button
                                onClick={() => {
                                  if (data.discord_checked) {
                                    registerToSession(
                                      book.book_written.story_details
                                        .story_title,
                                      book.book_written.story_details.story_url,
                                      book.book_written.story_details
                                        .story_cover
                                    );
                                  } else {
                                    setWarning(
                                      "Ton compte discord doit être vérifié par un admin pour inscrire ton histoire. Contacte-les sur Discord pour qu'ils valident ton compte."
                                    );
                                    setAlert(true);
                                    setTimeout(() => {
                                      setAlert(false);
                                    }, 3500);
                                  }
                                }}
                              >
                                Inscrire au concours
                              </button>
                            )}
                          {!exchange &&
                            book.book_written.isRegistered === "No" && (
                              <button
                                onClick={() => {
                                  if (data.discord_checked) {
                                    registerToExchange(
                                      book.book_written._id,
                                      book.book_written.isRegistered
                                    );
                                    setToken(token);
                                  } else {
                                    setWarning(
                                      "Ton compte discord doit être vérifié par un admin pour inscrire ton histoire. Contacte-les sur Discord pour qu'ils valident ton compte."
                                    );
                                    setAlert(true);
                                    setTimeout(() => {
                                      setAlert(false);
                                    }, 3500);
                                  }
                                }}
                              >
                                Inscrire à l'échange
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="progression">
              <h3>Progression</h3>
              <div>
                <label>
                  {" "}
                  Veux-tu que ta progression soit publique ?
                  {public_progress ? (
                    <input
                      type="checkbox"
                      id="publicProgress"
                      name="publicProgress"
                      checked
                      onChange={() => {
                        setPublicProgress(false);
                        setChange(true);
                      }}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="publicProgress"
                      name="publicProgress"
                      onChange={() => {
                        setPublicProgress(true);
                        setChange(true);
                      }}
                    />
                  )}{" "}
                  {public_progress ? "Oui" : "Non"}
                </label>
              </div>
              <br />
              <div className="settings">
                <label>
                  Objectif quotidien :
                  <input
                    type="number"
                    value={target_progress}
                    onChange={(event) => {
                      setTargetProgress(event.target.value);
                      setChange(true);
                    }}
                  />{" "}
                  mots{" "}
                  <button
                    onClick={() => {
                      update();
                    }}
                  >
                    Modifier
                  </button>
                </label>
                <label>
                  Nouvelle session :
                  <input
                    type="number"
                    placeholder="Nombre de mots écrits"
                    value={newProgress}
                    onChange={(event) => {
                      setNewProgress(event.target.value);
                    }}
                  />{" "}
                  <button
                    onClick={() => {
                      updateProgress("add");
                    }}
                  >
                    Ajouter
                  </button>{" "}
                  <button
                    onClick={() => {
                      updateProgress("replace");
                    }}
                  >
                    Remplacer
                  </button>
                </label>
              </div>
              {target_progress > 0 && (
                <div className="invisible-xs">
                  <Progression
                    progress={data.progress}
                    target={target_progress}
                  />
                </div>
              )}
            </div>
            <br />
            <div className="logout">
              <button
                onClick={() => {
                  setToken(null);
                  setStoriesRead(null);
                  setIsAdmin(false);
                }}
              >
                Se Déconnecter
              </button>{" "}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
