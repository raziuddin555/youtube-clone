// components/video/VideoPlayer.jsx — FE-06
import { useState } from "react";

function VideoPlayer({ src, poster }) {
  const [errored, setErrored] = useState(false);

  if (!src) {
    return <p>No video available</p>;
  }

  // Check if it's a YouTube URL
  const isYoutube =
    src.includes("youtube.com") || src.includes("youtu.be");

  let embedUrl = "";

  if (isYoutube) {
    let videoId = "";

    if (src.includes("youtu.be/")) {
      videoId = src.split("youtu.be/")[1].split("?")[0];
    } else if (src.includes("watch?v=")) {
      videoId = src.split("watch?v=")[1].split("&")[0];
    }

    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  if (isYoutube) {
    return (
      <div className="vp-wrapper">
        <iframe
          width="100%"
          height="500"
          src={embedUrl}
          title="YouTube Video"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    );
  }

  if (errored) {
    return (
      <div>
        <img src={poster} alt="" />
        <p>Video could not be loaded.</p>
      </div>
    );
  }

  return (
    <video
      className="vp-video"
      src={src}
      poster={poster}
      controls
      onError={() => setErrored(true)}
    />
  );
}

export default VideoPlayer;


