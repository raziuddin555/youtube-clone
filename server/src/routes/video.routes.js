// server/src/routes/video.routes.js
// GET    /api/videos                 list all (supports ?search= & ?category= query params)
// GET    /api/videos/:id             single video (also increments view count)
// POST   /api/videos                 (protected) create/upload video to a channel
// PUT    /api/videos/:id             (protected, owner only) edit video
// DELETE /api/videos/:id             (protected, owner only) delete video
// POST   /api/videos/:id/like        (protected) toggle like
// POST   /api/videos/:id/dislike     (protected) toggle dislike
// Phase 2 ticket: TICKET-BE-04, TICKET-BE-06 (search/filter)

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
} from "../controllers/video.controller.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);

export default router;