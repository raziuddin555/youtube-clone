// server/src/routes/auth.routes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// BE-07: required by AuthContext.getMe() on every page refresh
// Without this, stored token gets 404 → AuthContext clears it → user logged out on reload
router.get("/me", protect, async(req, res, next) => {
    try {
        // req.user from `protect` isn't populated — re-fetch with subscribedChannels
        // populated so the sidebar/channel page always have names+avatars to show.
        const user = await User.findById(req.user._id).populate(
            "subscribedChannels",
            "channelName avatar"
        );
        res.json({ user });
    } catch (err) {
        next(err);
    }
});

export default router;