// server/src/controllers/channel.controller.js
// Phase 2 ticket: TICKET-BE-03

import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";


// Create a new channel for the authenticated user
export const createChannel = async(req, res, next) => {
    try {
        const { channelName, description } = req.body;

        if (!channelName || !channelName.trim()) {
            return res.status(400).json({ message: "Channel name is required" });
        }

        // Enforce one channel per user
        const existing = await Channel.findOne({ owner: req.user._id });
        if (existing) {
            return res.status(409).json({ message: "You already have a channel" });
        }

        // Generate a simple handle from the channel name, e.g. "Code with John" -> "@CodewithJohn"
        const baseHandle = "@" + channelName.replace(/\s+/g, "");
        let handle = baseHandle;
        let suffix = 1;
        // Handles must be unique — if taken, append a number until it isn't
        while (await Channel.findOne({ handle })) {
            handle = `${baseHandle}${suffix}`;
            suffix++;
        }

        const channel = await Channel.create({
            channelName: channelName.trim(),
            handle,
            owner: req.user._id,
            description: description || "",
        });

        // Link the channel back onto the user
        await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });

        return res.status(201).json({ message: "Channel created", channel });
    } catch (err) {
        next(err);
    }
};

export const getChannelById = async(req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.id)
            .populate("owner", "username avatar")
            .populate("videos");

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        return res.status(200).json({ channel });
    } catch (err) {
        next(err);
    }
};


// updateChannel allows the owner of a channel to update its details. It checks if the authenticated user is the owner of the channel before allowing updates. The fields that can be updated include channelName, description, channelBanner, and avatar. If the channel is not found or the user is not authorized, appropriate error responses are returned.
export const updateChannel = async(req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.id);

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Owner-only check — this pattern repeats in every protected update/delete
        if (channel.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this channel" });
        }

        const { channelName, description, channelBanner, avatar } = req.body;
        if (channelName) channel.channelName = channelName.trim();
        if (description !== undefined) channel.description = description;
        if (channelBanner) channel.channelBanner = channelBanner;
        if (avatar) channel.avatar = avatar;

        await channel.save();

        return res.status(200).json({ message: "Channel updated", channel });
    } catch (err) {
        next(err);
    }
};

// POST /api/channels/:id/subscribe — toggle. `subscribers` on Channel is a
// plain counter (not a list of who), so the actual per-user relationship
// lives on User.subscribedChannels — this keeps both sides in sync.
export const toggleSubscribe = async(req, res, next) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        if (channel.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You can't subscribe to your own channel" });
        }

        const user = await User.findById(req.user._id);
        const idx = user.subscribedChannels.findIndex(
            (c) => c.toString() === channel._id.toString()
        );

        let subscribed;
        if (idx > -1) {
            user.subscribedChannels.splice(idx, 1);
            channel.subscribers = Math.max(0, channel.subscribers - 1);
            subscribed = false;
        } else {
            user.subscribedChannels.push(channel._id);
            channel.subscribers += 1;
            subscribed = true;
        }

        await Promise.all([user.save(), channel.save()]);

        return res.status(200).json({ subscribed, subscribers: channel.subscribers });
    } catch (err) {
        next(err);
    }
};