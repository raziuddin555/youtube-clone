// server/src/controllers/user.controller.js
// Everything here is inherently personal ("my history", "my watch later"...),
// so every route that uses these is mounted behind `protect` in user.routes.js —
// req.user is always guaranteed to exist by the time we get here.

import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import Playlist from "../models/Playlist.model.js";

const HISTORY_LIMIT = 200; // cap so a heavy user's array can't grow unbounded

/* ════════════════════════ Watch History ════════════════════════ */

// GET /api/users/me/history
export const getHistory = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "watchHistory.video",
            populate: { path: "channel", select: "channelName avatar" },
        });

        // If a video was deleted after being watched, its `video` populates to
        // null — drop those rather than showing a broken card.
        const history = user.watchHistory.filter((entry) => entry.video);

        return res.status(200).json({ history });
    } catch (err) {
        next(err);
    }
};

// POST /api/users/me/history/:videoId — called by the player on watch.
// De-dupes (re-watching moves the entry back to the top, doesn't duplicate it)
// and caps total length, matching how YouTube's own history behaves.
export const addHistory = async(req, res, next) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const user = await User.findById(req.user._id);
        user.watchHistory = user.watchHistory.filter(
            (entry) => entry.video.toString() !== videoId
        );
        user.watchHistory.unshift({ video: videoId, watchedAt: new Date() });
        user.watchHistory = user.watchHistory.slice(0, HISTORY_LIMIT);

        await user.save();
        return res.status(200).json({ message: "History updated" });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/users/me/history/:videoId — remove a single entry
export const removeHistoryEntry = async(req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { watchHistory: { video: req.params.videoId } },
        });
        return res.status(200).json({ message: "Removed from history" });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/users/me/history — clear everything
export const clearHistory = async(req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { watchHistory: [] });
        return res.status(200).json({ message: "History cleared" });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Watch Later ════════════════════════ */

// GET /api/users/me/watch-later
export const getWatchLater = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "watchLater",
            populate: { path: "channel", select: "channelName avatar" },
        });
        return res.status(200).json({ videos: user.watchLater });
    } catch (err) {
        next(err);
    }
};

// POST /api/users/me/watch-later/:videoId — toggle save/unsave
export const toggleWatchLater = async(req, res, next) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const user = await User.findById(req.user._id);
        const idx = user.watchLater.findIndex((id) => id.toString() === videoId);

        let saved;
        if (idx > -1) {
            user.watchLater.splice(idx, 1);
            saved = false;
        } else {
            user.watchLater.unshift(videoId);
            saved = true;
        }

        await user.save();
        return res.status(200).json({ saved });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Downloads ════════════════════════ */
// Same shape as Watch Later — no file is actually downloaded anywhere in
// this app, this is just a second saved/offline-marked list, mirroring how
// the real YouTube app's Downloads list works conceptually.

// GET /api/users/me/downloads
export const getDownloads = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "downloads",
            populate: { path: "channel", select: "channelName avatar" },
        });
        return res.status(200).json({ videos: user.downloads });
    } catch (err) {
        next(err);
    }
};

// POST /api/users/me/downloads/:videoId — toggle
export const toggleDownload = async(req, res, next) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const user = await User.findById(req.user._id);
        const idx = user.downloads.findIndex((id) => id.toString() === videoId);

        let downloaded;
        if (idx > -1) {
            user.downloads.splice(idx, 1);
            downloaded = false;
        } else {
            user.downloads.unshift(videoId);
            downloaded = true;
        }

        await user.save();
        return res.status(200).json({ downloaded });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Liked videos ════════════════════════ */

// GET /api/users/me/liked-videos
// Note: likes are stored as a plain array of user ids on Video (see
// Video.model.js), with no per-like timestamp — so there's no real way to
// sort this by "most recently liked". We sort by upload date instead rather
// than fake an ordering the data doesn't actually support.
export const getLikedVideos = async(req, res, next) => {
    try {
        const videos = await Video.find({ likes: req.user._id })
            .populate("channel", "channelName avatar")
            .sort({ createdAt: -1 });
        return res.status(200).json({ videos });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Your videos ════════════════════════ */

// GET /api/users/me/videos
export const getYourVideos = async(req, res, next) => {
    try {
        const videos = await Video.find({ uploader: req.user._id })
            .populate("channel", "channelName avatar")
            .sort({ createdAt: -1 });
        return res.status(200).json({ videos });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Subscriptions feed ════════════════════════ */

// GET /api/users/me/subscriptions — videos from channels this user follows
export const getSubscriptionsFeed = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.subscribedChannels.length) {
            return res.status(200).json({ videos: [] });
        }

        const videos = await Video.find({ channel: { $in: user.subscribedChannels } })
            .populate("channel", "channelName avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({ videos });
    } catch (err) {
        next(err);
    }
};

/* ════════════════════════ Save-menu status ════════════════════════ */

// GET /api/users/me/video-status/:videoId
// One cheap call for the "Save" panel (card 3-dot / watch-page Save button)
// to know which lists already contain this video, instead of fetching every
// full list and scanning it client-side just to check membership of one id.
export const getVideoSaveStatus = async(req, res, next) => {
    try {
        const { videoId } = req.params;

        const [user, playlistMatches] = await Promise.all([
            User.findById(req.user._id).select("watchLater downloads"),
            Playlist.find({ owner: req.user._id, videos: videoId }).select("_id"),
        ]);

        return res.status(200).json({
            inWatchLater: user.watchLater.some((id) => id.toString() === videoId),
            inDownloads: user.downloads.some((id) => id.toString() === videoId),
            playlistIds: playlistMatches.map((p) => p._id),
        });
    } catch (err) {
        next(err);
    }
};