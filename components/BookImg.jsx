import { useNavigate } from "react-router-dom";
import mockup from "../src/assets/book-mockup.png";
export default function BookImg({
  story_cover,
  story_title,
  story_id,
  story_url,
  size,
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (story_id) {
          navigate(`/book/${story_id}`);
        }
      }}
      className="book3D"
      style={{ height: `${size}px`, width: `${(size * 2) / 3}px` }}
    >
      {story_id ? (
        <>
          <img
            className="mockup"
            style={{
              height: `${size}px`,
            }}
            src={mockup}
            alt="mockup"
          />
          <img
            className="book-cover"
            style={{
              height: `${size * 0.828}px`,
              width: `${size * 0.4789}px`,
              bottom: `${size * 0.07}px`,
              left: `${size * 0.035}px`,
            }}
            src={story_cover}
            alt={story_title}
          />
        </>
      ) : (
        <a href={story_url} target="_blank">
          <img
            className="mockup"
            style={{
              height: `${size}px`,
            }}
            src={mockup}
            alt="mockup"
          />
          <img
            className="book-cover"
            style={{
              height: `${size * 0.828}px`,
              width: `${size * 0.4789}px`,
              bottom: `${size * 0.07}px`,
              left: `${size * 0.035}px`,
            }}
            src={story_cover}
            alt={story_title}
          />
        </a>
      )}
    </div>
  );
}
