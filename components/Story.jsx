import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookImg from "./BookImg";
export default function Story({ story }) {
  const navigate = useNavigate();
  const [isDisplay, setIsDisplay] = useState(false);
  return (
    <div
      onMouseOver={() => setIsDisplay(true)}
      onMouseLeave={() => setIsDisplay(false)}
      onClick={() => navigate(`/book/${story._id}`)}
    >
      <BookImg
        story_cover={story.story_details.story_cover}
        story_title={story.story_details.story_title}
        story_url={story.story_details.story_url}
        story_id={story._id}
        size={200}
      />
      {isDisplay && (
        <div
          onMouseOver={(event) => {
            event.stopPropagation();
          }}
          className="absolute"
        >
          {story.story_details.story_description.slice(0, 90)}
          {story.story_details.story_description.length > 90 && "..."}
        </div>
      )}
    </div>
  );
}
