// client/src/pages/ChannelPage.jsx — FE-07
// Rubric: Channel Page (40 marks) — create channel, list videos, edit/delete own videos.
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ChannelHeader from "../components/channel/ChannelHeader.jsx";
import ChannelVideoList from "../components/channel/ChannelVideoList.jsx";
import CreateChannelForm from "../components/channel/CreateChannelForm.jsx";
import { getChannelById, createChannel, toggleSubscribe } from "../services/channelService.js";
import { deleteVideo } from "../services/videoService.js";
import { useAuth } from "../hooks/useAuth.js";

function ChannelPage() {
  const { id } = useParams();
  const { user, isAuthed, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const isMe = id === "me";
  const isNew = id === "new";

  useEffect(() => {
    // "/channel/me" is a stable alias the rest of the app can always link
    // to (sidebar, header dropdown, etc.) without needing to know the
    // user's actual channel id up front — resolve it here, once.
    if (isMe) {
      if (authLoading) return; // AuthContext is still rehydrating the token
      if (!isAuthed) {
        navigate("/login", { replace: true });
      } else if (user?.channels?.length) {
        navigate(`/channel/${user.channels[0]}`, { replace: true });
      } else {
        navigate("/channel/new", { replace: true });
      }
      return;
    }

    // "new" means the user has no channel yet — skip fetch
    if (isNew) {
      setLoading(false);
      // Only show the form if the user is logged in
      setShowCreateForm(isAuthed);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    getChannelById(id)
      .then((res) => {
        if (!cancelled) setChannel(res.data.channel);
      })
      .catch(() => {
        if (!cancelled) setError("Channel not found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isAuthed, isMe, isNew, authLoading, user, navigate]);

  const isOwner = isAuthed && channel && user?._id === channel.owner?._id;

  // user.subscribedChannels comes back populated ({_id, channelName, avatar})
  // from /auth/me and /auth/login — but defend against a raw id string too,
  // in case it's ever read straight off a non-populated source.
  const isSubscribed = isAuthed && channel && (user?.subscribedChannels || []).some(
    (c) => (typeof c === "string" ? c : c._id) === channel._id
  );

  const handleToggleSubscribe = async () => {
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    setSubscribeLoading(true);
    try {
      const res = await toggleSubscribe(channel._id);
      // Update the header's count instantly instead of waiting on a refetch
      setChannel((prev) => ({ ...prev, subscribers: res.data.subscribers }));
      await refreshUser(); // syncs user.subscribedChannels so the button flips too
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update subscription.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleCreateChannel = async (payload) => {
    setCreating(true);
    setCreateError("");
    try {
      const res = await createChannel(payload);
      const newChannel = res.data.channel;
      // Re-fetch the user profile so AuthContext's `user.channels` includes
      // the new channel immediately — without this, the Header dropdown's
      // "Your channel" link stays pointed at the stale (pre-creation) list
      // until the next page refresh or login.
      await refreshUser();
      navigate(`/channel/${newChannel._id}`, { replace: true });
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Failed to create channel. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    try {
      await deleteVideo(videoId);
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete video.");
    }
  };

  // Render states
  if (loading) {
    return <div className="cp-loading">Loading channel…</div>;
  }

  // "new" channel route — not authed
  if (isNew && !isAuthed) {
    return (
      <div className="cp-gated">
        <p>You need to <Link to="/login">sign in</Link> to create a channel.</p>
      </div>
    );
  }

  // "new" channel route — authed, show create form
  if (isNew && showCreateForm) {
    return (
      <>
        {createError && <p className="cp-error">{createError}</p>}
        <CreateChannelForm onSubmit={handleCreateChannel} loading={creating} />
      </>
    );
  }

  if (error || !channel) {
    return (
      <div className="cp-error-page">
        <p>{error || "Channel not found."}</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="cp-body">
      <ChannelHeader
        channel={channel}
        isOwner={isOwner}
        isSubscribed={isSubscribed}
        subscribeLoading={subscribeLoading}
        onToggleSubscribe={handleToggleSubscribe}
      />

      <div className="cp-tabs">
        <button className="cp-tab cp-tab--active">Videos</button>
      </div>

      <div className="cp-content">
        <ChannelVideoList
          videos={channel.videos || []}
          isOwner={isOwner}
          onDelete={handleDeleteVideo}
        />
      </div>
    </div>
  );
}

export default ChannelPage;
