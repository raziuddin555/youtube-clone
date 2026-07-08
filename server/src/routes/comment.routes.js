// server/src/routes/comment.routes.js
// GET    /api/comments/video/:videoId    fetch all comments for a video
// POST   /api/comments                   (protected) add comment {videoId, text}
// PUT    /api/comments/:id               (protected, owner only) edit comment
// DELETE /api/comments/:id               (protected, owner only) delete comment
// Phase 2 ticket: TICKET-BE-05

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getCommentsForVideo,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/video/:videoId", getCommentsForVideo);
router.post("/", protect, addComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;