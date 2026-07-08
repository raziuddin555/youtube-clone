// server/src/models/Video.model.js
// Maps to rubric sample data: videoId, title, thumbnailUrl, description, channelId,
// uploader, views, likes, dislikes, uploadDate, videoUrl (per "Points to be Remembered" #1)
// "category" added explicitly — required for the 6-button filter requirement (rubric pg 9)
// Phase 2 ticket: TICKET-BE-04

import mongoose from "mongoose";

const CATEGORIES = [
    "Web Development",
    "JavaScript",
    "Data Structures",
    "Music",
    "Gaming",
    "Education",
    // add more as needed, but keep >= 6 distinct values seeded
];

const videoSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String, required: true },
        category: { type: String, enum: CATEGORIES, required: true },
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        views: { type: Number, default: 0 },
        likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }, // store user ids to prevent duplicate likes
        dislikes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
        isShort: { type: Boolean, default: false },
    }, { timestamps: true } // uploadDate derivable from createdAt
);

export const VIDEO_CATEGORIES = CATEGORIES;
export default mongoose.model("Video", videoSchema);