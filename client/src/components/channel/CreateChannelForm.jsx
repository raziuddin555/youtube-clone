// components/channel/CreateChannelForm.jsx — FE-07
// "How you'll appear" — matches the rubric screenshot style.
import { useState } from "react";

function CreateChannelForm({ onSubmit, loading }) {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName.trim()) {
      setError("Channel name is required");
      return;
    }
    setError("");
    await onSubmit({ channelName: channelName.trim(), description });
  };

  return (
    <div className="ccf-backdrop">
      <div className="ccf-modal">
        <h2 className="ccf-heading">How you&apos;ll appear</h2>

        {/* Avatar preview */}
        <div className="ccf-avatar-wrap">
          <div className="ccf-avatar">
            {channelName ? channelName[0].toUpperCase() : "?"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ccf-form">
          <div className="form-group">
            <label htmlFor="channelName">Channel name</label>
            <input
              id="channelName"
              type="text"
              value={channelName}
              onChange={(e) => { setChannelName(e.target.value); setError(""); }}
              placeholder="Your channel name"
              className={error ? "input-error" : ""}
              maxLength={50}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your channel"
              rows={3}
              className="ccf-textarea"
              maxLength={200}
            />
          </div>

          <p className="ccf-notice">
            By creating a channel you agree to our Terms of Service.
            Changes made to your name and profile picture are visible only on this site.
          </p>

          <div className="ccf-footer">
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating…" : "Create channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannelForm;
