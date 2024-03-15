import axios from "axios";
import { useState, useEffect } from "react";
import BookImg from "../components/BookImg";
import "../src/assets/concourspage.css";

export default function ConcoursPage() {
  const [authorsRegistered, setAuthorsRegistered] = useState();
  const [authorsActive, setAuthorsActive] = useState();
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const registered = await axios.get(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/authors/Registered"
        );
        setAuthorsRegistered(registered.data);
        const active = await axios.get(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/authors/Active"
        );
        setAuthorsActive(active.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAuthors();
  }, []);

  return isloading ? (
    <main>En cours de chargement...</main>
  ) : (
    <main className="concoursPage">
      <div className="explications">
        <strong>Le principe :</strong> <br />
        <ul>
          <li>
            Chaque participant est à la fois auteur de son histoire et jury de
            celle des autres.
          </li>
          <li>
            Chaque semaine, les participants doivent lire deux histoires tirées
            au sort (pas obligatoirement en entier, mais y consacrer au moins
            une heure chacune) et voter pour celle des deux qu'il préfère.{" "}
          </li>
          <li>
            {" "}
            À la fin du tournoi, le cumul des points donnera le classement des
            histoires.
          </li>
          <li>
            {" "}
            À la fin du tournoi, le cumul des points donnera le classement des
            histoires.
          </li>
        </ul>
      </div>
      <div className="explications">
        <strong>Qui peut participer ?</strong> <br />
        <ul>
          <li>
            Ce concours s'adresse aux auteurs <strong>majeurs</strong> qui ont
            publié une histoire (intégralement ou partiellement) sur Wattpad.
          </li>
          <li>
            Les conditions pour s'inscrire :
            <ul>
              <li>
                Être majeur (des histoires peuvent contenir du contenu mature)
              </li>
              <li>
                Avoir rejoint le{" "}
                <a href="https://discord.gg/ukhEHygEyf">
                  serveur Discord d'Entr'auteurs
                </a>
              </li>
              <li>Avoir lu le règlement jusqu'à la fin</li>
              <li>
                S'engager sur toute la durée du concours (7 semaines) à lire
                pendant une heure, chacune des deux histoires tirées au sort,
                chaque semaine.
              </li>
            </ul>
          </li>
        </ul>
        Après avoir lu le présent règlement, il faut s'inscrire en renseignant
        la clef "concours" Chaque semaine (dimanche matin, à partir de 10h), les
        participants découvrent les deux histoires qu'ils doivent lire depuis
        leur espace. Ils peuvent cliquer sur la couverture de l'image pour être
        directement redirigés vers le livre sur Wattpad. Toujours depuis leur
        espace, ils doivent voter pour l'histoire qu'ils ont préférée (en
        cliquant sur le bouton qui correspond). Ils ont jusqu'au samedi soir
        pour le faire (avant minuit).
      </div>
      <h2>Liste des participants inscrits pour la prochaine session.</h2>
      <br />
      <p>
        La session commencera début mai. Les inscriptions ouvriront fin
        mars/début avril. Rejoins le Discord pour ne manquer aucune info !
      </p>
      <br />
      <div className="authorsContainer">
        {authorsRegistered.authors.map((author, index) => {
          return (
            <div key={index}>
              <div>
                <strong className="username">{author.username}</strong>
              </div>
              <div>{author.story_title}</div>
              <BookImg
                story_cover={author.story_cover}
                story_title={author.story_title}
                story_url={author.story_url}
                story_id={author.story_id}
                size={200}
              />
            </div>
          );
        })}
      </div>
      <br />
      <h2>Liste des participants inscrits pour la session en cours.</h2>
      <br />
      <p>Du 3 mars au 21 avril 2024.</p>
      <br />
      <div className="authorsContainer">
        {authorsActive.authors.map((author, index) => {
          return (
            <div key={index}>
              <div>
                <strong className="username">{author.username}</strong>
              </div>
              <div>{author.story_title}</div>
              <BookImg
                story_cover={author.story_cover}
                story_title={author.story_title}
                story_url={author.story_url}
                story_id={author.story_id}
                size={200}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
