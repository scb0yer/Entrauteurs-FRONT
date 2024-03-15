import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import("../src/assets/sign.css");
import { useNavigate } from "react-router-dom";

export default function Signup({
  setToken,
  token,
  setStoriesRead,
  newStateHP,
  setNewStateHP,
  setDisplaySignin,
  setDisplaySignup,
  setWriterId,
}) {
  const [username, setUsername] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [target_progress, setTargetProgress] = useState("");
  const [mature, setMature] = useState(false);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState("");
  const [adult, setAdult] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const AdultChecking = () => {
      if (year && month && day && year.length === 4) {
        const birthday = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        const year2 = today.getFullYear();
        const month2 = today.getMonth();
        const day2 = today.getUTCDate();
        const minYear = year2 - 18;
        const majeurDate = new Date(minYear, month2, day2);
        if (birthday < majeurDate) {
          setAdult(true);
        } else {
          setAdult(false);
        }
      } else {
        setAdult(false);
      }
    };
    AdultChecking();
  }, [year]);

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      setBanner(null);
      if (acceptedFiles.length > 1) {
        alert("Tu ne peux pas ajouter qu'une seule photo.");
      } else {
        setPreview(URL.createObjectURL(acceptedFiles[0]));
        setBanner(acceptedFiles[0]);
      }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Dépose ta photo de couverture ici ou clique pour l'ajouter</p>
        <div>
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: "70vw", height: "200px", objectFit: "cover" }}
            />
          )}
        </div>
      </div>
    );
  }

  const signup = async () => {
    try {
      const wattpad = `https://www.wattpad.com/user/${username}`;
      if (username && email && day && month && year && password) {
        const formData = new FormData();
        formData.append("banner", banner);
        formData.append("username", username);
        formData.append("day", day);
        formData.append("month", month);
        formData.append("year", year);
        formData.append("facebook", facebook);
        formData.append("instagram", instagram);
        formData.append("wattpad", wattpad);
        formData.append("discord", discord);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("description", description);
        formData.append("target_progress", target_progress);
        formData.append("mature", mature);
        const { data } = await axios.post(
          "https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/signup",
          formData
        );
        console.log(data);
        const userToken = data.token;
        Cookies.set("token", userToken, { expires: 30 }, { secure: true });
        setToken(userToken);
        const writerId = data._id;
        Cookies.set("writerId", writerId, { expires: 30 }, { secure: true });
        setWriterId(writerId);
        setNewStateHP(!newStateHP);
        setDisplaySignup(false);
      } else {
        alert("Tous les champs obligatoires doivent être complétés.");
      }
    } catch (error) {
      console.log(error.message);
      alert("Une erreur s'est produite.");
    }
  };

  return (
    <main
      className="modal"
      onClick={() => {
        setDisplaySignup(false);
        navigate("/");
      }}
    >
      <div
        className="sign"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h1>Formulaire d'inscription</h1>
        <br />
        <div className="columns">
          {/* obligatoires */}
          <div>
            <h3>Champs obligatoires</h3>
            <label>
              Pseudo Wattpad :
              <input
                type="text"
                value={username}
                placeholder="Pseudo"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </label>
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
            <div>
              <label>
                Date de Naissance :
                <div className="birthday">
                  <select
                    name="month"
                    id="month-select"
                    onChange={(event) => {
                      setMonth(event.target.value);
                    }}
                  >
                    <option value="">--Mois--</option>
                    <option value="01">Janvier</option>
                    <option value="02">Février</option>
                    <option value="03">Mars</option>
                    <option value="04">Avril</option>
                    <option value="05">Mai</option>
                    <option value="06">Juin</option>
                    <option value="07">Juillet</option>
                    <option value="08">Août</option>
                    <option value="09">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                  </select>

                  {month && month === "02" ? (
                    <select
                      name="day"
                      id="day-select-feb"
                      onChange={(event) => {
                        setDay(event.target.value);
                      }}
                    >
                      <option value="">--Jour--</option>
                      <option value="01">1</option>
                      <option value="02">2</option>
                      <option value="03">3</option>
                      <option value="04">4</option>
                      <option value="05">5</option>
                      <option value="06">6</option>
                      <option value="07">7</option>
                      <option value="08">8</option>
                      <option value="09">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                      <option value="16">16</option>
                      <option value="17">17</option>
                      <option value="18">18</option>
                      <option value="19">19</option>
                      <option value="20">20</option>
                      <option value="21">21</option>
                      <option value="22">22</option>
                      <option value="23">23</option>
                      <option value="24">24</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                      <option value="27">27</option>
                      <option value="28">28</option>
                      <option value="29">29</option>
                    </select>
                  ) : month &&
                    (month === "04" ||
                      month === "06" ||
                      month === "09" ||
                      month === "11") ? (
                    <select
                      name="day"
                      id="day-select-30"
                      onChange={(event) => {
                        setDay(event.target.value);
                      }}
                    >
                      <option value="">--Jour--</option>
                      <option value="01">1</option>
                      <option value="02">2</option>
                      <option value="03">3</option>
                      <option value="04">4</option>
                      <option value="05">5</option>
                      <option value="06">6</option>
                      <option value="07">7</option>
                      <option value="08">8</option>
                      <option value="09">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                      <option value="16">16</option>
                      <option value="17">17</option>
                      <option value="18">18</option>
                      <option value="19">19</option>
                      <option value="20">20</option>
                      <option value="21">21</option>
                      <option value="22">22</option>
                      <option value="23">23</option>
                      <option value="24">24</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                      <option value="27">27</option>
                      <option value="28">28</option>
                      <option value="29">29</option>
                      <option value="30">30</option>
                    </select>
                  ) : (
                    month && (
                      <select
                        name="day"
                        id="day-select-31"
                        onChange={(event) => {
                          setDay(event.target.value);
                        }}
                      >
                        <option value="">--Jour--</option>
                        <option value="01">1</option>
                        <option value="02">2</option>
                        <option value="03">3</option>
                        <option value="04">4</option>
                        <option value="05">5</option>
                        <option value="06">6</option>
                        <option value="07">7</option>
                        <option value="08">8</option>
                        <option value="09">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                      </select>
                    )
                  )}
                  {day && (
                    <input
                      type="number"
                      placeholder="Année"
                      className="year"
                      onChange={(event) => {
                        setYear(event.target.value);
                      }}
                    />
                  )}
                </div>
              </label>
            </div>
            {adult && (
              <label>
                J'accepte de lire des histoires avec du contenu mature ?{" "}
                <input
                  type="checkbox"
                  id="matureReader"
                  name="matureReader"
                  onClick={() => {
                    setMature(!mature);
                  }}
                />{" "}
                {mature ? "Oui" : "Non"}
              </label>
            )}
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
          {/* Non obligatoires */}
          <div>
            <h3>Champs non obligatoires</h3>
            <label>
              Pseudo Discord *:
              <input
                type="text"
                value={discord}
                placeholder="Pseudo utilisé sur le serveur Discord"
                onChange={(event) => {
                  setDiscord(event.target.value);
                }}
              />
              <p>
                * Tant que tu n'auras pas rejoint le serveur Discord et
                renseigné ton pseudo, tu ne pourras pas participer aux échanges
                d'avis et au concours.
              </p>
            </label>
            <label>
              Lien Facebook :
              <input
                type="text"
                value={facebook}
                placeholder="https://www.facebook.com/..."
                onChange={(event) => {
                  setFacebook(event.target.value);
                }}
              />
            </label>
            <label>
              Lien Instagram :
              <input
                type="text"
                value={instagram}
                placeholder="https://www.instagram.com/..."
                onChange={(event) => {
                  setInstagram(event.target.value);
                }}
              />
            </label>
            <label>
              Présentation :
              <textarea
                rows={6}
                cols={40}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </label>
            <label>
              Objectif quotidien (nombre de mots écrits):
              <input
                type="number"
                value={target_progress}
                placeholder="Nombre de mots"
                onChange={(event) => {
                  setTargetProgress(event.target.value);
                }}
              />
            </label>
          </div>
        </div>

        {/* <MyDropzone className="dropzone" /> */}
        <button
          onClick={() => {
            signup();
          }}
        >
          S'inscrire
        </button>
        <div
          onClick={() => {
            setDisplaySignin(true);
            setDisplaySignup(false);
          }}
        >
          Déjà un compte ? Connecte-toi ici.
        </div>
      </div>
    </main>
  );
}
