import { useState, useEffect } from "react";
export default function Loading({ isLoading }) {
  const [gif, setGif] = useState(null);
  useEffect(() => {
    setGif(
      "https://res.cloudinary.com/dlltxf0rr/image/upload/v1710427615/entrauteurs/book-reversed-bgremoved_qbmn81.gif"
    );
    setTimeout(() => {
      setGif(null);
    }, 2990);
  }, [isLoading]);
  return (
    <div>
      {gif && <div style={{ border: "none" }}>En cours de chargement...</div>}
      <img src={gif} alt="gif" style={{ width: "200px" }} />
    </div>
  );
}
