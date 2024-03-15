import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import gif from "../src/assets/book.gif";
import("../src/assets/passwordpage.css");
import { useNavigate } from "react-router-dom";

export default function PasswordPage({
  token,
  setToken,
  setStoriesRead,
  setWriterId,
}) {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const [newToken, setNewToken] = useState();

  const onChange = (event, target) => {
    if (target === "token") {
      setNewToken(event.target.value);
    } else if (target === "password") {
      setPassword(event.target.value);
    }
  };

  useEffect(() => {
    if (token) {
      setNewToken(token);
    }
  }, []);

  const passwordReset = async () => {
    try {
      if (!newToken || !password) {
        setWarning("Il faut renseigner le mot de passe et la clé.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3500);
      } else {
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/update",
          { password },
          {
            headers: {
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        const userToken = data.connexion_details.token;
        Cookies.set("token", userToken, { expires: 30 }, { secure: true });
        setToken(userToken);
        const writerId = data._id;
        Cookies.set("writerId", writerId, { expires: 30 }, { secure: true });
        setWriterId(writerId);
        const storiesRead = JSON.stringify(data.stories_read);
        Cookies.set("storiesRead", storiesRead, { expires: 7 });
        setStoriesRead(storiesRead);
        setWarning("Ton mot de passe a bien été mis à jour.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
          navigate("/profil");
        }, 3500);
        setPassword("");
      }
    } catch (error) {
      console.log(error.message);
      setWarning("Un problème est survenu.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3500);
    }
  };

  return (
    <main className="passwordpage">
      {alert && (
        <div className="alert">
          <div>{warning}</div>
          <img src={gif} alt="gif" />
        </div>
      )}
      <form>
        <h2>Changer ton mot de passe</h2>
        <section className="infos">
          {!token && (
            <>
              <div>
                <label className="invisible" htmlFor="token">
                  Clé secrète :
                </label>
                <input
                  type="text"
                  className="input-form"
                  id="token"
                  name="token"
                  placeholder="Clé reçue par email"
                  value={newToken}
                  onChange={(event) => {
                    onChange(event, "token");
                  }}
                />
              </div>
              <p className="smallText">
                Demande ta clé secrète en remplissant le formulaire en bas de
                page, en utilisant l'adresse-email avec laquelle tu t'es
                inscrit(e).
              </p>
            </>
          )}
          <div>
            <label className="invisible" htmlFor="newpassword">
              Nouveau mot de passe :
            </label>
            <input
              type="password"
              className="input-form"
              id="newpassword"
              name="newpassword"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(event) => {
                onChange(event, "password");
              }}
            />
          </div>
          <div>
            <button
              onClick={(event) => {
                event.preventDefault();
                passwordReset();
              }}
            >
              Changer le mot de passe
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
