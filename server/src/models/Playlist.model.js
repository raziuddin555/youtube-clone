// server/src/models/Playlist.model.js
// A user-owned, named list of videos. Watch Later and Liked videos are NOT
// playlists in this app — they're their own dedicated lists (see User.model.js
// watchLater, and Video.likes) — this model is only for playlists the user
// explicitly creates themselves (e.g. "DSA Revision", "Watch with friends").

import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
        name: { type: String, required: true, trim: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    }, { timestamps: true } // updatedAt doubles as "last modified" for sorting the list view
);

export default mongoose.model("Playlist", playlistSchema);