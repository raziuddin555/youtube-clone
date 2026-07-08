// server/src/controllers/auth.controller.js
// Phase 2 ticket: TICKET-BE-01

import { validationResult } from "express-validator";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async(req, res, next) => {
    // 1. Check if any validator rule failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        // 2. Make sure no existing user has this email OR username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Email or username already in use" });
        }

        // 3. Create the user — password gets hashed automatically by the pre("save") hook
        const user = await User.create({ username, email, password });

        // 4. Per the rubric: do NOT auto-login on register, just confirm success.
        //    The frontend will redirect to /login itself.
        return res.status(201).json({
            message: "Registration successful",
            user, // password is already stripped by the toJSON transform
        });
        // } catch (err) {
        //     next(err); // hands off to errorHandler.js
        // }
    } catch (err) {
        console.log("REGISTER ERROR:", err);
        return res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
};

export const loginUser = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email }).populate(
            "subscribedChannels",
            "channelName avatar"
        );
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Compare the submitted password against the stored hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Issue a token
        const token = generateToken(user._id);

        return res.status(200).json({
            message: "Login successful",
            token,
            user,
        });
    } catch (err) {
        next(err);
    }
};