import { useState, useEffect } from "react";
import axios from "axios";
import("../src/assets/contestationmodal.css");
import AlertDisplay from "../components/Alert";

export default function Contestation({
  token,
  setDisplayContestation,
  story_review,
}) {
  const [object, setObject] = useState();
  const [message, setMessage] = useState();
  const [isloading, setIsloading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState(false);

  const postConstestation = async () => {
    try {
      if (object && message) {
        setIsloading(true);
        const date = new Date();
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/contestation/add`,
          { object, message, story_review, date },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsloading(false);
        setWarning("L'histoire a bien été ajoutée aux histoires lues");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
          setDisplayContestation(false);
        }, 3000);
      } else {
        setWarning("Tous les champs sont obligatoires.");
        setAlert(true);
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

  return (
    <main
      className="modal"
      onClick={() => {
        setDisplayContestation(false);
      }}
    >
      {alert && <AlertDisplay warning={warning} />}
      <div
        className="contestation"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3>Formulaire de contestation</h3>
        <form>
          <label>
            Objet :{" "}
            <input
              type="text"
              placeholder="Écris l'objet principal de ta contestation"
              value={object}
              onChange={(event) => {
                setObject(event.target.value);
              }}
            />
          </label>
          <label>
            Message :{" "}
            <textarea
              value={message}
              placeholder="Précise maintenant les points sur lesquels tu es en désaccord, en étant le plus explicite possible, donnant des exemples..."
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
          </label>
          <button
            onClick={() => {
              postConstestation();
            }}
          >
            Envoyer
          </button>
        </form>
      </div>
    </main>
  );
}
