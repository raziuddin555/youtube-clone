// server/src/controllers/comment.controller.js
// Phase 2 ticket: TICKET-BE-05
// Full CRUD required by rubric ("implement full CRUD operations for comments
// directly from the video player page").

import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";

export const getCommentsForVideo = async(req, res, next) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId })
            .populate("user", "username avatar")
            .sort({ createdAt: -1 }); // newest first

        return res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
};

export const addComment = async(req, res, next) => {
    try {
        const { video, text } = req.body;

        if (!video || !text || !text.trim()) {
            return res.status(400).json({ message: "video and text are required" });
        }

        // Confirm the video actually exists before allowing a comment on it
        const videoExists = await Video.findById(video);
        if (!videoExists) {
            return res.status(404).json({ message: "Video not found" });
        }

        const comment = await Comment.create({
            video,
            user: req.user._id,
            text: text.trim(),
        });

        // populate before sending back, so the frontend has the username immediately
        await comment.populate("user", "username avatar");

        return res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
        next(err);
    }
};

export const updateComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "text is required" });
        }

        comment.text = text.trim();
        await comment.save();
        await comment.populate("user", "username avatar");

        return res.status(200).json({ message: "Comment updated", comment });
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        next(err);
    }
};