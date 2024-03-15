import { useState, useEffect } from "react";
export default function AlertDisplay({ warning }) {
  const [gif, setGif] = useState(null);
  useEffect(() => {
    setGif(
      "https://res.cloudinary.com/dlltxf0rr/image/upload/v1710270097/entrauteurs/bookActivityIndicator_ryx5ip.gif"
    );
    setTimeout(() => {
      setGif(null);
    }, 2980);
  }, [warning]);
  return (
    <div className="alert">
      {gif && <div>{warning}</div>}
      <img src={gif} alt="gif" />
    </div>
  );
}
