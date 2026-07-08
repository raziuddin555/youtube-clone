// components/video/VideoGrid.jsx
// Rubric: Home Page UI/UX — grid of video thumbnails.
// TICKET-FE-04

import VideoCard from "./VideoCard.jsx";

function VideoGrid({
  videos,
  loading,
  error,
  emptyTitle = "No videos found",
  emptyMessage = "Try a different search or filter.",
}) {
  if (loading) {
    return (
      <div className="video-grid video-grid--loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="video-card-skeleton">
            <div className="skeleton skeleton--thumb" />
            <div className="video-card-skeleton__info">
              <div className="skeleton skeleton--avatar" />
              <div className="video-card-skeleton__lines">
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line skeleton--line-short" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-grid__empty">
        <p>⚠️ Could not load videos. Is the server running?</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="video-grid__empty">
        <p className="video-grid__empty-title">{emptyTitle}</p>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}
    </div>
  );
}

export default VideoGrid;
