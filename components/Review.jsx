import { useState, useEffect } from "react";
import axios from "axios";
import("../src/assets/reviewmodal.css");
import AlertDisplay from "../components/Alert";

export default function Review({ token, setDisplayReview, setIsInExchange }) {
  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(0);
  const [note3, setNote3] = useState(0);
  const [note4, setNote4] = useState(0);
  const [note5, setNote5] = useState(0);
  const [change, setChange] = useState(0);
  const [average, setAverage] = useState(0);
  const [comment1, setComment1] = useState();
  const [comment2, setComment2] = useState();
  const [comment3, setComment3] = useState();
  const [comment4, setComment4] = useState();
  const [comment5, setComment5] = useState();

  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();

  useEffect(() => {
    const total = note1 + note2 + note3 + note4 + note5;
    setAverage(total / 2);
  }, [change]);

  const postReview = async () => {
    try {
      if (
        note1 &&
        note2 &&
        note3 &&
        note4 &&
        note5 &&
        comment1 &&
        comment2 &&
        comment3 &&
        comment4 &&
        comment5
      ) {
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/review/add",
          {
            note1,
            note2,
            note3,
            note4,
            note5,
            comment1,
            comment2,
            comment3,
            comment4,
            comment5,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setWarning("Ton avis a bien été envoyé.");
        setAlert(true);
        setIsInExchange(false);
        setTimeout(() => {
          setAlert(false);
          setDisplayReview(false);
        }, 3000);
      } else {
        setWarning("Tous les champs doivent être renseignés.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
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
        setDisplayReview(false);
      }}
    >
      {alert && <AlertDisplay warning={warning} />}
      <div
        className="review"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3>Remplir la fiche avis</h3>
        <form>
          <div>
            <div>Orthographe</div>
            <div>
              <label>
                {" "}
                Commentaire :{" "}
                <textarea
                  value={comment1}
                  onChange={(event) => {
                    setComment1(event.target.value);
                  }}
                />
              </label>
              <label>
                {" "}
                Note :{" "}
                <label>
                  {" "}
                  0
                  <input
                    type="radio"
                    name="note1"
                    value={note1}
                    onClick={() => {
                      setNote1(0);
                      const total = note1 + note2 + note3 + note4 + note5;
                      setAverage(total);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  1
                  <input
                    type="radio"
                    name="note1"
                    value={note1}
                    onClick={() => {
                      setNote1(1);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  2
                  <input
                    type="radio"
                    name="note1"
                    value={note1}
                    onClick={() => {
                      setNote1(2);
                      setChange(!change);
                    }}
                  />
                </label>
              </label>
            </div>
          </div>
          <div>
            <div>Style</div>
            <div>
              <label>
                {" "}
                Commentaire :{" "}
                <textarea
                  value={comment2}
                  onChange={(event) => {
                    setComment2(event.target.value);
                  }}
                />
              </label>
              <label>
                <label>
                  Note : 0
                  <input
                    type="radio"
                    name="note2"
                    value={note2}
                    onClick={() => {
                      setNote2(0);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  1
                  <input
                    type="radio"
                    name="note2"
                    value={note2}
                    onClick={() => {
                      setNote2(1);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  2
                  <input
                    type="radio"
                    name="note2"
                    value={note2}
                    onClick={() => {
                      setNote2(2);
                      setChange(!change);
                    }}
                  />
                </label>
              </label>
            </div>
          </div>
          <div>
            <div>Cohérence</div>
            <div>
              <label>
                {" "}
                Commentaire :{" "}
                <textarea
                  value={comment3}
                  onChange={(event) => {
                    setComment3(event.target.value);
                  }}
                />
              </label>
              <label>
                <label>
                  Note : 0
                  <input
                    type="radio"
                    name="note3"
                    value={note3}
                    onClick={() => {
                      setNote3(0);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  1
                  <input
                    type="radio"
                    name="note3"
                    value={note3}
                    onClick={() => {
                      setNote3(1);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  2
                  <input
                    type="radio"
                    name="note3"
                    value={note3}
                    onClick={() => {
                      setNote3(2);
                      setChange(!change);
                    }}
                  />
                </label>
              </label>
            </div>
          </div>
          <div>
            <div>Suspens</div>
            <div>
              <label>
                {" "}
                Commentaire :{" "}
                <textarea
                  value={comment4}
                  onChange={(event) => {
                    setComment4(event.target.value);
                  }}
                />
              </label>
              <label>
                <label>
                  Note : 0
                  <input
                    type="radio"
                    name="note4"
                    value={note4}
                    onClick={() => {
                      setNote2(0);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  1
                  <input
                    type="radio"
                    name="note4"
                    value={note4}
                    onClick={() => {
                      setNote4(1);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  2
                  <input
                    type="radio"
                    name="note4"
                    value={note4}
                    onClick={() => {
                      setNote4(2);
                      setChange(!change);
                    }}
                  />
                </label>
              </label>
            </div>
          </div>
          <div>
            <div>Dialogues</div>
            <div>
              <label>
                {" "}
                Commentaire :{" "}
                <textarea
                  value={comment5}
                  onChange={(event) => {
                    setComment5(event.target.value);
                  }}
                />
              </label>
              <label>
                <label>
                  Note : 0
                  <input
                    type="radio"
                    name="note5"
                    value={note5}
                    onClick={() => {
                      setNote5(0);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  1
                  <input
                    type="radio"
                    name="note5"
                    value={note5}
                    onClick={() => {
                      setNote5(1);
                      setChange(!change);
                    }}
                  />
                </label>
                <label>
                  {" "}
                  2
                  <input
                    type="radio"
                    name="note5"
                    value={note5}
                    onClick={() => {
                      setNote5(2);
                      setChange(!change);
                    }}
                  />
                </label>
              </label>
            </div>
          </div>
        </form>
        <div>
          Note globale : {average}/5{" "}
          <button
            onClick={() => {
              postReview();
            }}
          >
            Envoyer l'avis
          </button>
        </div>
      </div>
    </main>
  );
}
