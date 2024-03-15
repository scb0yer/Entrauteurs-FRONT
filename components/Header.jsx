import { Link } from "react-router-dom";
import logo from "../src/assets/logo.png";
import "../src/assets/header.css";

export default function Header({
  displaySignin,
  displaySignup,
  displayStoryUpdate,
  displayReview,
  displayContestation,
  token,
}) {
  return (
    <header>
      {displaySignin
        ? document.body.classList.add("scroll-lock")
        : displaySignup
        ? document.body.classList.add("scroll-lock")
        : displayStoryUpdate
        ? document.body.classList.add("scroll-lock")
        : displayReview
        ? document.body.classList.add("scroll-lock")
        : displayContestation
        ? document.body.classList.add("scroll-lock")
        : document.body.classList.remove("scroll-lock")}
      <div className="relative">
        <div>
          <Link className="logo" to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="absolute"></div>
        <div className="navigation">
          <Link className="btn" to="/concours">
            Le Concours
          </Link>
          <Link className="btn" to="/concept">
            Le Concept
          </Link>
          <Link className="btn" to="/stories">
            Les Histoires
          </Link>
          <Link className="btn" to="/profil">
            {token ? "Mon espace" : "Se Connecter"}
          </Link>
        </div>
      </div>
    </header>
  );
}
