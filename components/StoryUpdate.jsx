import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gif from "../src/assets/book.gif";
import "../src/assets/storymodal.css";

export default function StoryUpdate({
  token,
  setDisplayStoryUpdate,
  displayStoryUpdate,
  storyToUpdate,
  setStoryToUpdate,
  adult,
}) {
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const [story_title, setStory_title] = useState();
  const [story_url, setStory_url] = useState();
  const [story_cover, setStory_cover] = useState();
  const [story_cat, setStory_cat] = useState();
  const [story_description, setStory_description] = useState();
  const [story_mature, setStory_mature] = useState(false);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (storyToUpdate.story_id) {
      setStory_title(storyToUpdate.story_title);
      setStory_url(storyToUpdate.story_url);
      setStory_cover(storyToUpdate.story_cover);
      setStory_cat(storyToUpdate.story_cat);
      setStory_description(storyToUpdate.story_description);
      setStory_mature(storyToUpdate.story_mature);
    }
  }, []);

  const saveStory = async () => {
    setIsloading(true);
    try {
      let missingDatas = false;
      if (
        !story_cat ||
        !story_description ||
        !story_title ||
        !story_cover ||
        !story_url
      ) {
        setWarning(`Tous les champs doivent être renseignés.`);
        missingDatas = true;
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3100);
      } else if (
        story_cover.slice(0, 30) !== "https://img.wattpad.com/cover/"
      ) {
        setWarning(
          `L'adresse de la couverture de ton livre doit commencer par "https://img.wattpad.com/cover/"`
        );
        missingDatas = true;
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3100);
      } else if (story_url.slice(0, 30) !== "https://www.wattpad.com/story/") {
        setWarning(
          `L'adresse de ton livre doit commencer par "https://www.wattpad.com/story/"`
        );
        missingDatas = true;
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3100);
      }
      if (!storyToUpdate.story_id && !missingDatas) {
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/book/add`,
          {
            story_title,
            story_url,
            story_cover,
            story_cat,
            story_description,
            story_mature,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsloading(false);
        setWarning("Ton histoire a bien été ajoutée");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
          setDisplayStoryUpdate(false);
        }, 3100);
        setStoryToUpdate({});
      } else if (!missingDatas) {
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/book/update`,
          {
            story_title,
            story_url,
            story_cover,
            story_cat,
            story_description,
            story_mature,
            book_id: storyToUpdate.story_id,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsloading(false);
        setWarning("Ton histoire a bien été modifiée");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
          setDisplayStoryUpdate(false);
        }, 3100);
        setStoryToUpdate({});
      }
    } catch (error) {
      console.log(error.message);
      setIsloading(false);
    }
  };

  return (
    <main
      className="modal"
      onClick={() => {
        setDisplayStoryUpdate(false);
        setStoryToUpdate({});
      }}
    >
      <div
        className="story-modal"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {alert && (
          <div className="alert">
            <div>{warning}</div>
            <img src={gif} alt="gif" />
          </div>
        )}
        <h1>
          {storyToUpdate.story_id
            ? "Modifier une histoire"
            : "Ajouter une nouvelle histoire"}
        </h1>
        <form>
          <label>
            Titre :{" "}
            <input
              type="text"
              placeholder="Tel qu'il est sur wattpad"
              value={story_title}
              onChange={(event) => {
                setStory_title(event.target.value);
              }}
            />
          </label>
          <label>
            Lien Wattpad :{" "}
            <input
              type="url"
              placeholder="Le lien vers le résumé de ton livre sur wattpad (avec le https://)"
              value={story_url}
              onChange={(event) => {
                setStory_url(event.target.value);
              }}
            />
          </label>
          <label>
            Lien Couverture du livre *:{" "}
            <input
              type="url"
              placeholder="Le lien vers la couverture de ton livre sur wattpad (avec le https://)"
              value={story_cover}
              onChange={(event) => {
                setStory_cover(event.target.value);
              }}
            />
          </label>
          <p>
            * Tu peux retrouver ce lien en faisant un clic droit sur la
            couverture de ton livre, depuis ton compte wattpad. Le lien doit
            commencer par https://img.wattpad.com/cover/
          </p>
          <label>
            Catégorie :
            {story_cat ? (
              <select
                name="category"
                id="category"
                onChange={(event) => {
                  setStory_cat(event.target.value);
                }}
              >
                <option value={story_cat}>{story_cat}</option>
                <option value="Imaginaire">Imaginaire</option>
                <option value="Romance">Romance</option>
                <option value="Autre">Autre</option>
              </select>
            ) : (
              <select
                name="category"
                id="category"
                onChange={(event) => {
                  setStory_cat(event.target.value);
                }}
              >
                <option value="">--Categorie--</option>
                <option value="Imaginaire">Imaginaire</option>
                <option value="Romance">Romance</option>
                <option value="Autre">Autre</option>
              </select>
            )}
          </label>
          <label>
            Description :{" "}
            <textarea
              type="text"
              placeholder="Court résumé de ton histoire, en quelques phrases."
              value={story_description}
              onChange={(event) => {
                setStory_description(event.target.value);
              }}
            />
          </label>
          {adult && (
            <label>
              Histoire avec du contenu mature ?{" "}
              {story_mature && (
                <input
                  type="checkbox"
                  id="matureStory"
                  checked
                  onChange={() => {
                    setStory_mature(false);
                  }}
                />
              )}
              {!story_mature && (
                <input
                  type="checkbox"
                  id="matureStory"
                  onChange={() => {
                    setStory_mature(true);
                  }}
                />
              )}
              {story_mature ? "oui" : "non"}
            </label>
          )}
        </form>
        <button
          onClick={() => {
            saveStory();
          }}
        >
          Valider
        </button>
      </div>
    </main>
  );
}
