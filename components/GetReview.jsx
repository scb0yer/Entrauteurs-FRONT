import axios from "axios";
import { useState, useEffect } from "react";
import BookImg from "./BookImg";

export default function GetReview({
  token,
  id,
  contestation,
  setWarning,
  setAlert,
  setChange,
  change,
}) {
  const [data, setData] = useState(null);
  useEffect(() => {
    try {
      const getReview = async () => {
        const { data } = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/review/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setData(data);
      };
      getReview();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const checkReview = async (body) => {
    console.log(body);
    try {
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/admin/contestation/${contestation._id}`,
        body,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("Les modifications ont bien été enregistrées");
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
  return (
    <>
      {data && (
        <div>
          <h3 style={{ textAlign: "right" }}>
            Avis contesté par {data.writer.writer_details.username}
          </h3>
          <div className="contestationDisplay">
            <BookImg
              story_cover={data.book.story_details.story_cover}
              story_title={data.book.story_details.story_title}
              story_url={data.book.story_details.story_url}
              story_id={data.book._id}
              size={150}
            />
            <div className="review_details">
              <div>
                <h4>Orthographe</h4>
                {data.review_details.orthographe.comment1} -{" "}
                {data.review_details.orthographe.note1}/2
              </div>
              <div>
                <h4>Style</h4>
                {data.review_details.style.comment2} -{" "}
                {data.review_details.style.note2}/2
              </div>
              <div>
                <h4>Cohérence</h4>
                {data.review_details.coherence.comment3} -{" "}
                {data.review_details.coherence.note3}/2
              </div>
              <div>
                <h4>Suspens</h4>
                {data.review_details.suspens.comment4} -{" "}
                {data.review_details.suspens.note4}/2
              </div>
              <div>
                <h4>Dialogues</h4>
                {data.review_details.dialogues.comment5} -{" "}
                {data.review_details.dialogues.note5}/2
              </div>
            </div>
            <div className="contestation_details">
              <div>Date: {contestation.date.slice(0, 10)}</div>
              <div>
                Status:{" "}
                {contestation.status === "pending"
                  ? "En cours de traitement"
                  : contestation.status === "unread" && "Nouvelle contestation"}
              </div>
              <div>Objet: {contestation.object}</div>
              <div>Message: {contestation.message}</div>
              <div className="btn-contestation">
                <button
                  className="validate-review"
                  onClick={() => {
                    checkReview({ status: "complete", validate: true });
                  }}
                >
                  Valider l'avis
                </button>
                <button
                  className="cancel-review"
                  onClick={() => {
                    checkReview({ status: "complete", nullify: true });
                  }}
                >
                  Annuler l'avis
                </button>

                <button
                  className="pending-contestation"
                  onClick={() => {
                    checkReview({ status: "pending" });
                  }}
                >
                  Mettre en attente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
