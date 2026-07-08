// server/src/controllers/comment.controller.js
// Phase 2 ticket: TICKET-BE-05
// Full CRUD required by rubric ("implement full CRUD operations for comments
// directly from the video player page").

import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";

// comment.controller.js handles all comment-related operations, including retrieving comments for a specific video, adding new comments, updating existing comments, and deleting comments. Each function ensures that the user is authenticated and authorized to perform the action, and it interacts with the Comment and Video models to manage comment data in the database.
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

//  add comment, update comment, delete comment functions are defined below. Each function checks for required fields, validates user authorization, and interacts with the Comment model to perform the respective operations. Responses are sent back to the client with appropriate status codes and messages.
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


//  delete comment function is defined below. It checks if the comment exists and if the authenticated user is authorized to delete it. If both conditions are met, the comment is deleted from the database, and a success message is returned to the client.
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