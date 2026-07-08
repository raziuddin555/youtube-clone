// server/src/controllers/video.controller.js
// Phase 2 ticket: TICKET-BE-04, TICKET-BE-06 (search/filter)

import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";

// Escapes regex metacharacters so search input is matched literally.
// Without this, a query like "C++" or "(a+)+$" either fails to match what
// the user actually meant, or — in the worst case — triggers catastrophic
// backtracking (ReDoS) on a crafted pattern.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getVideos = async(req, res, next) => {
    try {
        const { search, category, isShort } = req.query;
        const filter = {};

        if (search) {
            // case-insensitive partial match on title, with literal special chars
            filter.title = { $regex: escapeRegex(search), $options: "i" };
        }
        if (category) {
            filter.category = category;
        }
        if (isShort !== undefined) {
            filter.isShort = isShort === "true";
        }

        const videos = await Video.find(filter)
            .populate("channel", "channelName avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({ videos });
    } catch (err) {
        next(err);
    }
};

export const getVideoById = async(req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id, { $inc: { views: 1 } }, // increment views atomically on every fetch
            { new: true } // return the document AFTER the increment, not before
        ).populate("channel", "channelName avatar owner");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        return res.status(200).json({ video });
    } catch (err) {
        next(err);
    }
};

export const createVideo = async(req, res, next) => {
    try {
        const { title, description, thumbnailUrl, videoUrl, category, isShort } = req.body;

        if (!title || !thumbnailUrl || !videoUrl || !category) {
            return res.status(400).json({
                message: "title, thumbnailUrl, videoUrl, and category are required",
            });
        }

        // The uploader must own a channel — videos always belong to a channel
        const channel = await Channel.findOne({ owner: req.user._id });
        if (!channel) {
            return res.status(400).json({ message: "Create a channel before uploading videos" });
        }

        const video = await Video.create({
            title,
            description: description || "",
            thumbnailUrl,
            videoUrl,
            category,
            isShort: !!isShort,
            channel: channel._id,
            uploader: req.user._id,
        });

        // Keep the channel's video list in sync
        await Channel.findByIdAndUpdate(channel._id, { $push: { videos: video._id } });

        return res.status(201).json({ message: "Video created", video });
    } catch (err) {
        next(err);
    }
};

export const updateVideo = async(req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this video" });
        }

        const { title, description, thumbnailUrl, videoUrl, category, isShort } = req.body;
        if (title) video.title = title;
        if (description !== undefined) video.description = description;
        if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
        if (videoUrl) video.videoUrl = videoUrl;
        if (category) video.category = category;
        if (isShort !== undefined) video.isShort = !!isShort;

        await video.save();
        return res.status(200).json({ message: "Video updated", video });
    } catch (err) {
        next(err);
    }
};

export const deleteVideo = async(req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this video" });
        }

        await Video.findByIdAndDelete(req.params.id);

        // Remove it from the channel's video list too
        await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } });

        return res.status(200).json({ message: "Video deleted" });
    } catch (err) {
        next(err);
    }
};

export const likeVideo = async(req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const userId = req.user._id.toString();
        const alreadyLiked = video.likes.some((id) => id.toString() === userId);

        if (alreadyLiked) {
            // toggle off
            video.likes = video.likes.filter((id) => id.toString() !== userId);
        } else {
            video.likes.push(req.user._id);
            // liking removes any existing dislike from this user
            video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
        }

        await video.save();
        return res.status(200).json({
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length,
            userHasLiked: !alreadyLiked,
        });
    } catch (err) {
        next(err);
    }
};

export const dislikeVideo = async(req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const userId = req.user._id.toString();
        const alreadyDisliked = video.dislikes.some((id) => id.toString() === userId);

        if (alreadyDisliked) {
            video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
        } else {
            video.dislikes.push(req.user._id);
            video.likes = video.likes.filter((id) => id.toString() !== userId);
        }

        await video.save();
        return res.status(200).json({
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length,
            userHasDisliked: !alreadyDisliked,
        });
    } catch (err) {
        next(err);
    }
};