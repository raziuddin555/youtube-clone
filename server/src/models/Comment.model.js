// server/src/models/Comment.model.js
// Maps to rubric sample data: commentId, userId, text, timestamp
// Stored as its own collection (not embedded) so full CRUD + edit/delete is simple
// and matches "Data Handling (MongoDB)" rubric line re: comments.
// Phase 2 ticket: TICKET-BE-05

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
        video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true },
    }, { timestamps: true } // timestamp == createdAt, updatedAt shows edits
);

export default mongoose.model("Comment", commentSchema);