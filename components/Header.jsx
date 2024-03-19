import { Link } from "react-router-dom";
import logo from "../src/assets/logo.png";
import { useState } from "react";
import "../src/assets/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header({
  displaySignin,
  displaySignup,
  displayStoryUpdate,
  displayReview,
  displayContestation,
  displayStickersSelection,
  token,
}) {
  const [displayMenu, setDisplayMenu] = useState(false);
  return (
    <header
      onClick={() => {
        setDisplayMenu(false);
      }}
    >
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
        : displayStickersSelection
        ? document.body.classList.add("scroll-lock")
        : document.body.classList.remove("scroll-lock")}
      <div className="relative">
        <div>
          <Link className="logo" to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="absolute"></div>
        <div className="navigation invisible-xs">
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
        <div className="invisible-l navigation-xs">
          <div className="invisible-xxs">
            <Link className="btn" to="/profil">
              <FontAwesomeIcon icon="user" size="xl" />
            </Link>
          </div>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {" "}
            <FontAwesomeIcon
              icon="bars"
              size="xl"
              onClick={() => {
                setDisplayMenu(true);
                console.log(displayMenu);
              }}
            />
          </div>
        </div>
        {displayMenu && (
          <div className="menu">
            <Link className="btn visible-xxs" to="/profil">
              {token ? "Mon espace" : "Se Connecter"}
            </Link>
            <Link className="btn" to="/concept">
              Le Concept
            </Link>
            <Link className="btn" to="/concours">
              Le Concours
            </Link>
            <Link className="btn" to="/stories">
              Les Histoires
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
