// server/src/routes/user.routes.js
// GET    /api/users/me/history              watch history, newest first
// POST   /api/users/me/history/:videoId     log/refresh a watch
// DELETE /api/users/me/history/:videoId     remove one entry
// DELETE /api/users/me/history              clear all history
// GET    /api/users/me/watch-later          saved-for-later list
// POST   /api/users/me/watch-later/:videoId toggle save
// GET    /api/users/me/downloads            "downloaded" list (no real file)
// POST   /api/users/me/downloads/:videoId   toggle
// GET    /api/users/me/liked-videos         videos this user has liked
// GET    /api/users/me/videos               videos this user has uploaded
// GET    /api/users/me/subscriptions        feed from subscribed channels

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getHistory,
    addHistory,
    removeHistoryEntry,
    clearHistory,
    getWatchLater,
    toggleWatchLater,
    getDownloads,
    toggleDownload,
    getLikedVideos,
    getYourVideos,
    getSubscriptionsFeed,
    getVideoSaveStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

// Every route under /api/users is "me"-scoped and personal — require auth
// for the whole router instead of repeating `protect` on each line.
router.use(protect);

router.get("/me/history", getHistory);
router.post("/me/history/:videoId", addHistory);
router.delete("/me/history/:videoId", removeHistoryEntry);
router.delete("/me/history", clearHistory);

router.get("/me/watch-later", getWatchLater);
router.post("/me/watch-later/:videoId", toggleWatchLater);

router.get("/me/downloads", getDownloads);
router.post("/me/downloads/:videoId", toggleDownload);

router.get("/me/liked-videos", getLikedVideos);
router.get("/me/videos", getYourVideos);
router.get("/me/subscriptions", getSubscriptionsFeed);
router.get("/me/video-status/:videoId", getVideoSaveStatus);

export default router;