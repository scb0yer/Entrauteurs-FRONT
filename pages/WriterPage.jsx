import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import banner from "../src/assets/banner.jpg";
import "../src/assets/profilpage.css";
import wattpad from "../src/assets/wattpad_min.png";
import discord from "../src/assets/discord_min.png";

export default function WriterPage({ token, storiesRead }) {
  const [data, setData] = useState([]);
  const [readList, setReadList] = useState();
  const [isloading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const Datas = async () => {
      try {
        if (storiesRead) {
          const readBooks = JSON.parse(storiesRead);
          setReadList(readBooks);
        }
        const { data } = await axios.get(
          `https://site--entrauteurs-backend--dzk9mdcz57cb.code.run/writer/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("writer>>>", data);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    Datas();
  }, []);
  return (
    <main>
      {isloading && <>En cours de chargement</>}
      {!isloading && (
        <>
          <div className="banner">
            {data.banner ? (
              <img src={data.banner} alt="couverture" />
            ) : (
              <img src={banner} alt="couverture" />
            )}
          </div>
        </>
      )}
    </main>
  );
}
