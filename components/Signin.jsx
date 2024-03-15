import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import("../src/assets/sign.css");
import { useNavigate } from "react-router-dom";

export default function Signin({
  setToken,
  setStoriesRead,
  newStateHP,
  setNewStateHP,
  setDisplaySignin,
  setDisplaySignup,
  setWriterId,
  setIsAdmin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signin = async () => {
    try {
      const { data } = await axios.post(
        "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/login",
        {
          email: email,
          password: password,
        }
      );
      console.log(data);
      const userToken = data.writer.token;
      Cookies.set("token", userToken, { expires: 30 }, { secure: true });
      setToken(userToken);
      if (data.writer.role === "Admin") {
        const isAdmin = true;
        Cookies.set("isAdmin", isAdmin, { expires: 30 }, { secure: true });
        setIsAdmin(true);
      }
      const writerId = data.writer._id;
      Cookies.set("writerId", writerId, { expires: 30 }, { secure: true });
      setWriterId(writerId);
      const storiesRead = JSON.stringify(data.writer.stories_read);
      Cookies.set("storiesRead", storiesRead, { expires: 7 });
      setStoriesRead(storiesRead);
      setNewStateHP(!newStateHP);
      setDisplaySignin(false);
    } catch (error) {
      console.log(error.message);
      alert(
        "Mauvais identifiants. Tu dois entrer l'adresse avec laquelle tu t'es inscrit(e)."
      );
    }
  };

  return (
    <main
      className="modal"
      onClick={() => {
        setDisplaySignin(false);
        navigate("/");
      }}
    >
      <div
        className="signin"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h1>Formulaire de connexion</h1>
        <br />
        <div>
          <label>
            Email :
            <input
              type="email"
              value={email}
              placeholder="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
          <label>
            Mot de passe :
            <input
              type="password"
              value={password}
              placeholder="mot de passe"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>
        </div>
        <button
          onClick={() => {
            signin();
          }}
        >
          Se connecter
        </button>
        <div
          onClick={() => {
            setDisplaySignin(false);
            setDisplaySignup(true);
          }}
        >
          Pas encore de compte ? Inscris-toi ici.
        </div>
        <div
          onClick={() => {
            navigate("/password");
            setDisplaySignin(false);
          }}
        >
          Mot de passe oublié ?
        </div>
      </div>
    </main>
  );
}
