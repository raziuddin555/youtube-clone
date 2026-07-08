// server/src/middleware/auth.middleware.js
// Verifies JWT from Authorization header, attaches req.user. Used to protect
// routes like: create channel, create/edit/delete video, create/edit/delete comment.
// Phase 2 ticket: TICKET-BE-02

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async(req, res, next) => {
    let token;

    // Expect header format: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user fresh from the DB (don't just trust the token's payload —
        // the user could have been deleted since the token was issued).
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user no longer exists" });
        }

        req.user = user; // password already excluded by the toJSON transform on the model
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
};