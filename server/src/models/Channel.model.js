// server/src/models/Channel.model.js
// Maps to rubric sample data: channelId, channelName, owner, description,
// channelBanner, subscribers, videos[]
// Phase 2 ticket: TICKET-BE-03

import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, trim: true }, // e.g. @CodeWithJohn
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "" },
    channelBanner: { type: String, default: "" },
    avatar: { type: String, default: "" },
    subscribers: { type: Number, default: 0 },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);