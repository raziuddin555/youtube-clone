// client/src/pages/HistoryPage.jsx
import { useState, useEffect } from "react";
import VideoGrid from "../components/video/VideoGrid.jsx";
import { getHistory, clearHistory } from "../services/userService.js";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getHistory()
      .then((res) => {
        if (!cancelled) setHistory(res.data.history);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm("Clear your entire watch history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await clearHistory();
      setHistory([]);
    } catch {
      alert("Failed to clear history. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  // Each entry is { video, watchedAt } — VideoGrid only needs the video itself.
  const videos = history.map((entry) => entry.video);

  return (
    <div className="library-page">
      <div className="library-page__header">
        <h1>Watch history</h1>
        {videos.length > 0 && (
          <button className="library-page__action-btn" onClick={handleClearAll} disabled={clearing}>
            Clear all watch history
          </button>
        )}
      </div>

      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        emptyTitle="No watch history"
        emptyMessage="Videos you watch will show up here."
      />
    </div>
  );
}

export default HistoryPage;
