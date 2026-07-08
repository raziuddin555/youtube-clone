// components/video/SaveMenu.jsx
// The "..." save panel used on video cards and the watch page — lets a
// signed-in user toggle Watch later / Downloads and add/remove the video
// from their own playlists, all from one place. This mirrors how YouTube's
// own "Save to playlist" flyout folds Watch later in as just another row
// instead of giving it a separate button.
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getVideoSaveStatus, toggleWatchLater, toggleDownload } from "../../services/userService.js";
import {
  getMyPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../../services/playlistService.js";

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" height="16" width="16" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

function SaveMenu({ videoId }) {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [status, setStatus] = useState({ inWatchLater: false, inDownloads: false, playlistIds: [] });
  const [playlists, setPlaylists] = useState([]);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // Close on outside click — same pattern as the header's account dropdown.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const [statusRes, playlistsRes] = await Promise.all([
        getVideoSaveStatus(videoId),
        getMyPlaylists(),
      ]);
      setStatus(statusRes.data);
      setPlaylists(playlistsRes.data.playlists);
    } catch {
      // Quiet failure — this is a convenience panel, not a critical flow.
      // Worst case it just shows everything unchecked.
    } finally {
      setLoadingStatus(false);
    }
  };

  // The trigger sits inside a <Link> (video card thumbnail) — preventDefault
  // here is what stops that Link from navigating when this is clicked.
  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    const next = !open;
    setOpen(next);
    setCreating(false);
    if (next) loadStatus();
  };

  const stopBubble = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleToggleWatchLater = async () => {
    setBusy(true);
    try {
      const res = await toggleWatchLater(videoId);
      setStatus((s) => ({ ...s, inWatchLater: res.data.saved }));
    } finally {
      setBusy(false);
    }
  };

  const handleToggleDownload = async () => {
    setBusy(true);
    try {
      const res = await toggleDownload(videoId);
      setStatus((s) => ({ ...s, inDownloads: res.data.downloaded }));
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePlaylist = async (playlistId, alreadyIn) => {
    setBusy(true);
    try {
      if (alreadyIn) {
        await removeVideoFromPlaylist(playlistId, videoId);
        setStatus((s) => ({ ...s, playlistIds: s.playlistIds.filter((id) => id !== playlistId) }));
      } else {
        await addVideoToPlaylist(playlistId, videoId);
        setStatus((s) => ({ ...s, playlistIds: [...s.playlistIds, playlistId] }));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const name = newName.trim();
    if (!name) return;

    setBusy(true);
    try {
      const res = await createPlaylist(name);
      const playlist = res.data.playlist;
      await addVideoToPlaylist(playlist._id, videoId);
      setPlaylists((prev) => [playlist, ...prev]);
      setStatus((s) => ({ ...s, playlistIds: [...s.playlistIds, playlist._id] }));
      setNewName("");
      setCreating(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`save-menu${open ? " save-menu--open" : ""}`} ref={wrapRef}>
      <button className="save-menu__trigger" onClick={handleTriggerClick} aria-label="Save options">
        <MoreIcon />
      </button>

      {open && (
        <div className="save-menu__panel" onClick={stopBubble}>
          {loadingStatus ? (
            <p className="save-menu__loading">Loading…</p>
          ) : (
            <>
              <label className="save-menu__row">
                <input
                  type="checkbox"
                  checked={status.inWatchLater}
                  disabled={busy}
                  onChange={handleToggleWatchLater}
                />
                Watch later
              </label>
              <label className="save-menu__row">
                <input
                  type="checkbox"
                  checked={status.inDownloads}
                  disabled={busy}
                  onChange={handleToggleDownload}
                />
                Download
              </label>

              {playlists.length > 0 && (
                <>
                  <div className="save-menu__divider" />
                  <div className="save-menu__playlists">
                    {playlists.map((p) => (
                      <label key={p._id} className="save-menu__row">
                        <input
                          type="checkbox"
                          checked={status.playlistIds.includes(p._id)}
                          disabled={busy}
                          onChange={() => handleTogglePlaylist(p._id, status.playlistIds.includes(p._id))}
                        />
                        <span className="save-menu__row-label">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              <div className="save-menu__divider" />

              {creating ? (
                <form className="save-menu__new-form" onSubmit={handleCreatePlaylist}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Playlist name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={60}
                  />
                  <button type="submit" disabled={busy || !newName.trim()}>Create</button>
                </form>
              ) : (
                <button type="button" className="save-menu__new-btn" onClick={() => setCreating(true)}>
                  + New playlist
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SaveMenu;
