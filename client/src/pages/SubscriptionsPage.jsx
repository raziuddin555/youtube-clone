// client/src/pages/SubscriptionsPage.jsx
import { useState, useEffect } from "react";
import VideoGrid from "../components/video/VideoGrid.jsx";
import { getSubscriptionsFeed } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";

function SubscriptionsPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getSubscriptionsFeed()
      .then((res) => {
        if (!cancelled) setVideos(res.data.videos);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const hasSubscriptions = (user?.subscribedChannels || []).length > 0;

  return (
    <div className="library-page">
      <div className="library-page__header">
        <h1>Subscriptions</h1>
      </div>

      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        emptyTitle={hasSubscriptions ? "No new videos" : "No subscriptions yet"}
        emptyMessage={
          hasSubscriptions
            ? "New videos from channels you follow will show up here."
            : "Subscribe to a channel to see its videos here."
        }
      />
    </div>
  );
}

export default SubscriptionsPage;
