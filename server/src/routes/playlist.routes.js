// server/src/routes/playlist.routes.js
// GET    /api/playlists                  my playlists (no public browsing)
// POST   /api/playlists                  create
// GET    /api/playlists/:id              one playlist, videos populated
// PUT    /api/playlists/:id              rename
// DELETE /api/playlists/:id              delete
// POST   /api/playlists/:id/videos/:videoId    add video
// DELETE /api/playlists/:id/videos/:videoId    remove video

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getMyPlaylists,
    createPlaylist,
    getPlaylistById,
    renamePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = express.Router();

// Playlists are always personal in this app — no public playlist pages exist.
router.use(protect);

router.get("/", getMyPlaylists);
router.post("/", createPlaylist);
router.get("/:id", getPlaylistById);
router.put("/:id", renamePlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:id/videos/:videoId", addVideoToPlaylist);
router.delete("/:id/videos/:videoId", removeVideoFromPlaylist);

export default router;