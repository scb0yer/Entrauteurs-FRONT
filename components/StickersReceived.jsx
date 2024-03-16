import axios from "axios";
import { useState } from "react";
import AlertDisplay from "../components/Alert";
import("../src/assets/stickersmodal.css");

export default function StickersReceived({
  token,
  messages,
  setDisplayStickersReceived,
}) {
  const eraseSticker = async () => {
    try {
      const { data } = await axios.post(
        `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/resetMessages`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <main
      className="modal"
      onClick={() => {
        eraseSticker();
        setDisplayStickersReceived(false);
      }}
    >
      <div
        className="stickers-modal"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3>Clique sur le sticker que tu veux envoyer !</h3>
        <div className="stickersList">
          {messages.map((message, index) => {
            return (
              <a
                className="sticker-received"
                key={index}
                href={`/writer/${message.sender_id}`}
                target="_blank"
              >
                {message.sender} t'a envoyé :
                <img
                  className="sticker"
                  src={message.message}
                  alt="sticker"
                  onClick={() => {
                    sendSticker({ message: message });
                  }}
                />
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
