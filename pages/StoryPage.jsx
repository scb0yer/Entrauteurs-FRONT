import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import("../src/assets/storypage.css");
import wattpad from "../src/assets/wattpad_min.png";
import discord from "../src/assets/discord_min.png";
import BookImg from "../components/BookImg";
import AlertDisplay from "../components/Alert";
import Loading from "../components/Loading";

export default function StoryPage({
  token,
  storiesRead,
  setDisplaySignin,
  writerId,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isAlreadyRead, setIsAlreadyRead] = useState(false);
  const { id } = useParams();
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const rating = [0, 1, 2, 3, 4];

  useEffect(() => {
    const Datas = async () => {
      try {
        const { data } = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/book/${id}`
        );
        setStory(data);
        console.log(data);
        if (storiesRead) {
          const readBooks = JSON.parse(storiesRead);
          for (let s = 0; s < readBooks.length; s++) {
            if (readBooks[s].book_read === data._id) {
              setIsAlreadyRead(true);
            }
          }
        }
        const reviewsList = [];
        for (let r = 0; r < data.story_reviews.length; r++) {
          const id = data.story_reviews[r].story_review.reviewer;
          const reviewer = await axios.get(
            `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/${id}`
          );
          reviewsList.push({
            review: data.story_reviews[r].story_review,
            reviewer: reviewer.data.writer_details.username,
            id: reviewer.data._id,
          });
        }
        setReviews(reviewsList);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    Datas();
  }, [token]);

  const readStory = async () => {
    try {
      if (writerId === story.writer._id) {
        setWarning("Tu ne peux pas marquer comme lue ta propre histoire.");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/read/${id}`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAlreadyRead(true);
        setIsLoading(false);
        setWarning("L'histoire a bien été ajoutée aux histoires lues");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="storypage">
      {alert && <AlertDisplay warning={warning} />}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <>
          <div className="bloc1">
            <div>
              <BookImg
                story_cover={story.story_details.story_cover}
                story_title={story.story_details.story_title}
                story_url={story.story_details.story_url}
                size={300}
              />
            </div>
            <div className="details">
              <h3>{story.story_details.story_title}</h3>
              <div>
                {story.story_details.story_cat} 📚
                {story.story_details.story_mature ? (
                  <span>
                    <FontAwesomeIcon icon="circle-exclamation" size="xs" />{" "}
                    Contenu mature
                  </span>
                ) : (
                  <span>Tout public</span>
                )}
              </div>
              {story.note > 0 ? (
                <div className="rate">
                  <div>
                    {rating.map((rate, index) => {
                      let half = false;
                      if (story.note - Math.floor(story.note) > 0) {
                        half = true;
                      }
                      if (rate < Math.floor(story.note)) {
                        return <FontAwesomeIcon key={index} icon="star" />;
                      } else if (rate === Math.floor(story.note) && half) {
                        return <FontAwesomeIcon key={index} icon="star-half" />;
                      }
                    })}
                  </div>
                  <span className="note">{story.note}/5</span>
                </div>
              ) : (
                <div>Pas encore de note</div>
              )}
              <div>
                {!isAlreadyRead ? (
                  <button
                    onClick={() => {
                      if (token) {
                        readStory();
                      } else {
                        setDisplaySignin(true);
                      }
                    }}
                  >
                    Marquer comme lue
                  </button>
                ) : (
                  <p>Histoire déjà lue</p>
                )}
              </div>
            </div>
            <div className="details">
              <h3>À propos de l'auteur</h3>
              <div>
                <img className="logo" src={wattpad} alt="logo wattpad" />{" "}
                {story.writer.writer_details.username}
              </div>
              {story.writer.writer_details.discord && (
                <div>
                  <img className="logo" src={discord} alt="logo discord" />{" "}
                  {story.writer.writer_details.discord}
                </div>
              )}
              <div>
                <a href={story.writer.writer_details.wattpad} target="_blank">
                  ✒︎ Profil Wattpad
                </a>
              </div>
            </div>
          </div>
          <div className="description">
            {story.story_details.story_description}
          </div>
          <div className="readers">
            <h3>Lecteurs</h3>
            <div>
              {story.readers &&
                story.readers.length > 0 &&
                story.readers.map((reader, index) => {
                  return (
                    <div key={index}>
                      {/* {reader.reader.writer_details.username} */}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="reviews">
            <h3>Avis reçus</h3>
            {story.story_reviews.map((review, index) => {
              let reviewerName = "";
              for (let r = 0; r < reviews.length; r++) {
                if (reviews[r].review._id === review.story_review._id) {
                  reviewerName = reviews[r].reviewer;
                }
              }
              return (
                <div key={index} className="review">
                  <h4>
                    Avis laissé par {reviewerName} lors de l'échange de{" "}
                    {review.story_review.exchange_name}
                  </h4>
                  <div>
                    <div>Orthographe</div>
                    <div className="comment">
                      {review.story_review.review_details.orthographe.comment1}
                    </div>
                    <div>
                      {review.story_review.review_details.orthographe.note1}/2
                    </div>
                  </div>
                  <div>
                    <div>Style</div>
                    <div className="comment">
                      {review.story_review.review_details.style.comment2}
                    </div>
                    <div>
                      {review.story_review.review_details.style.note2}/2
                    </div>
                  </div>
                  <div>
                    <div>Cohérence</div>
                    <div className="comment">
                      {review.story_review.review_details.coherence.comment3}
                    </div>
                    <div>
                      {review.story_review.review_details.coherence.note3}/2
                    </div>
                  </div>
                  <div>
                    <div>Suspens</div>
                    <div className="comment">
                      {review.story_review.review_details.suspens.comment4}
                    </div>
                    <div>
                      {review.story_review.review_details.suspens.note4}/2
                    </div>
                  </div>
                  <div>
                    <div>Dialogues</div>
                    <div className="comment">
                      {review.story_review.review_details.dialogues.comment5}
                    </div>
                    <div>
                      {review.story_review.review_details.dialogues.note5}/2
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
