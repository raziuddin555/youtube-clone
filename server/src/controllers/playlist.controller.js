// server/src/controllers/playlist.controller.js
// Playlists are always private to their owner in this app — there's no
// public playlist browsing, so every handler below double-checks ownership
// rather than trusting the :id alone.

import Playlist from "../models/Playlist.model.js";
import Video from "../models/Video.model.js";

// GET /api/playlists — all of the current user's playlists (videos NOT
// populated here — the list view only needs name + count, not full cards).
export const getMyPlaylists = async(req, res, next) => {
    try {
        const playlists = await Playlist.find({ owner: req.user._id }).sort({ updatedAt: -1 });
        return res.status(200).json({ playlists });
    } catch (err) {
        next(err);
    }
};

//  createPlaylist, getPlaylistById, renamePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist functions are defined below. Each function checks for required fields, validates user authorization, and interacts with the Playlist and Video models to perform the respective operations. Responses are sent back to the client with appropriate status codes and messages.

export const createPlaylist = async(req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Playlist name is required" });
        }

        const playlist = await Playlist.create({
            name: name.trim(),
            owner: req.user._id,
            videos: [],
        });

        return res.status(201).json({ message: "Playlist created", playlist });
    } catch (err) {
        next(err);
    }
};

// GET /api/playlists/:id — full detail, videos populated for the grid view

export const getPlaylistById = async(req, res, next) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate({
            path: "videos",
            populate: { path: "channel", select: "channelName avatar" },
        });

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this playlist" });
        }

        return res.status(200).json({ playlist });
    } catch (err) {
        next(err);
    }
};

// PUT /api/playlists/:id  { name } — rename
// Rename a playlist. The new name is sent in the request body. The handler checks if the playlist exists and if the authenticated user is the owner before allowing the rename operation. If successful, it returns the updated playlist.

export const renamePlaylist = async(req, res, next) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this playlist" });
        }

        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Playlist name is required" });
        }

        playlist.name = name.trim();
        await playlist.save();
        return res.status(200).json({ message: "Playlist renamed", playlist });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/playlists/:id
// Delete a playlist. The handler checks if the playlist exists and if the authenticated user is the owner before allowing the delete operation. If successful, it returns a success message.
export const deletePlaylist = async(req, res, next) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this playlist" });
        }

        await Playlist.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Playlist deleted" });
    } catch (err) {
        next(err);
    }
};

// POST /api/playlists/:id/videos/:videoId — add (no-op if already in there)
// Add video 
export const addVideoToPlaylist = async(req, res, next) => {
    try {
        const { id, videoId } = req.params;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this playlist" });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const alreadyIn = playlist.videos.some((v) => v.toString() === videoId);
        if (!alreadyIn) {
            playlist.videos.push(videoId);
            await playlist.save();
        }

        return res.status(200).json({
            message: alreadyIn ? "Already in this playlist" : "Added to playlist",
            playlist,
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/playlists/:id/videos/:videoId — remove
export const removeVideoFromPlaylist = async(req, res, next) => {
    try {
        const { id, videoId } = req.params;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this playlist" });
        }

        playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId);
        await playlist.save();

        return res.status(200).json({ message: "Removed from playlist", playlist });
    } catch (err) {
        next(err);
    }
};