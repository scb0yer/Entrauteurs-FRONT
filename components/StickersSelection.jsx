import axios from "axios";
import { useState } from "react";
import AlertDisplay from "../components/Alert";
import("../src/assets/stickersmodal.css");

export default function StickersSelection({
  token,
  recipientId,
  setDisplayStickersSelection,
}) {
  const [alert, setAlert] = useState(false);
  const [warning, setWarning] = useState();
  const messagesList = [
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/wine_qphgtq.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/typing_fsoncc.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156856/entrauteurs/messages/tired-sleep_ud0nnn.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/thanks_cvl5nn.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/search_swa11z.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156855/entrauteurs/messages/sad_boybdk.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/penguin-ganbatte_lr9kbf.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/miss-you_rwokmy.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156854/entrauteurs/messages/mad-angry_nbbbo5.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/kisses_d3p7ym.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/luck_sbj71c.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156853/entrauteurs/messages/hello_dxk6rc.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/dream-it-do-it_dwzxql.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/coffee_cfar5r.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/clap_dqgpor.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/cat-computer_xrwklq.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/angry-typing_o3p993.gif",
    "https://res.cloudinary.com/dlltxf0rr/image/upload/v1709156852/entrauteurs/messages/birthday_s0oxux.gif",
  ];

  const sendSticker = async (message) => {
    try {
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/send/${recipientId}`,
        message,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setWarning("Le sticker a bien été envoyé !");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        setDisplayStickersSelection(false);
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
    <main
      className="modal"
      onClick={() => {
        setDisplayStickersSelection(false);
      }}
    >
      <div
        className="stickers-modal"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {" "}
        {alert && <AlertDisplay warning={warning} />}
        <h3>Clique sur le sticker que tu veux envoyer !</h3>
        <div className="stickersList">
          {messagesList.map((message, index) => {
            return (
              <img
                key={index}
                className="sticker hover"
                src={message}
                alt="sticker"
                onClick={() => {
                  sendSticker({ message: message });
                }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
