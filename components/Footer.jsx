import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import("../src/assets/footer.css");
import Facebook from "../src/assets/facebook.png";
import Discord from "../src/assets/discord.png";
import Wattpad from "../src/assets/wattpad.png";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [object, setObject] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (event, target) => {
    if (target === "name") {
      setName(event.target.value);
    } else if (target === "object") {
      setObject(event.target.value);
    } else if (target === "message") {
      setMessage(event.target.value);
    } else if (target === "email") {
      setEmail(event.target.value);
    }
  };

  const sendEmail = async () => {
    try {
      if (name && email && object && message) {
        if (email.indexOf("@") !== -1) {
          const response = await axios.post(
            `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/sendEmail`,
            {
              name: name,
              email: email,
              object: object,
              message: message,
            }
          );
          alert("Ton message a bien été envoyé");
          setEmail("");
          setName("");
          setObject("");
          setMessage("");
        } else {
          alert("Tu dois renseigner une adresse email valide.");
        }
      } else {
        alert("Tu dois remplir tous les champs !");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="footer" id="contact">
      <h2>
        Besoin de renseignements? Envoie-moi un message ou retrouve-moi sur les
        réseaux sociaux.
      </h2>
      <div className="container">
        <div className="contact">
          <div>
            <label htmlFor="name" className="invisible">
              Nom ou Pseudo :
            </label>
            <input
              type="text"
              className="input-form"
              id="name"
              name="name"
              placeholder="Ton nom"
              value={name}
              onChange={(event) => {
                onChange(event, "name");
              }}
            />
          </div>
          <div>
            <label htmlFor="object" className="invisible">
              Objet du message :
            </label>
            <input
              type="text"
              className="input-form"
              id="object"
              name="object"
              placeholder="Objet de ton message"
              value={object}
              onChange={(event) => {
                onChange(event, "object");
              }}
            />
          </div>
          <div>
            <label htmlFor="message" className="invisible">
              Message :
            </label>
            <textarea
              className="input-form message"
              id="message"
              name="message"
              placeholder="Ton message"
              value={message}
              onChange={(event) => {
                onChange(event, "message");
              }}
            />
          </div>
          <div>
            <label htmlFor="email" className="invisible">
              Email :
            </label>
            <input
              type="email"
              className="input-form"
              id="email"
              name="email"
              placeholder="Ton email"
              value={email}
              onChange={(event) => {
                onChange(event, "email");
              }}
            />
          </div>
          <div>
            <input
              type="button"
              id="submit"
              className="submit"
              name="submit"
              value="Envoyer"
              onClick={() => {
                sendEmail();
              }}
            />
          </div>
        </div>
        <div className="rightColumn">
          <div>
            <div>
              <a href="https://www.wattpad.com/user/SCBoyer">
                <img src={Wattpad} className="network" alt="logo Wattpad" />
              </a>
            </div>
            <div>
              <a href="https://www.facebook.com/groups/618862230267140">
                <img src={Facebook} className="network" alt="logo Facebook" />{" "}
              </a>
            </div>
          </div>
          <div>
            <a href="https://discord.gg/ukhEHygEyf">
              <button className="DiscordButton">
                <img
                  src={Discord}
                  className="network Discord"
                  alt="logo Discord"
                />
                Rejoins-nous sur Discord !
              </button>
            </a>
            <p style={{ fontSize: "16px", lineHeight: "18px" }}>
              <br />
              <a
                href="https://www.canva.com/design/DAGCqCPIqqc/iGEmh3nvZ-7L1YehtA2oYQ/view?utm_content=DAGCqCPIqqc&utm_campaign=designshare&utm_medium=link&utm_source=editor"
                target="_blank"
                alt="tuto discord"
              >
                Tu ne connais pas Discord ? Clique ici pour découvrir comment ça
                fonctionne.
              </a>
            </p>
          </div>
          <div className="réglementation">
            <button
              onClick={() => {
                navigate("/mentionslegales");
              }}
            >
              Mentions légales et CGU
            </button>
            <button
              onClick={() => {
                navigate("/cookies");
              }}
            >
              Politique de cookies (UE)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
