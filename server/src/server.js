// server/src/server.js
// Entry point. Boots the Express app, connects to MongoDB, starts listening.
// Phase 1 ticket: keep this file thin — all real logic lives in routes/controllers.

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

// ----- Route imports -----
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

// ----- Error middleware (Phase 1 ticket: implement these) -----
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ----- Global middleware -----
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// ----- Health check (keep this — useful for grading/demo too) -----
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ytclone-api" });
});

// ----- Mount routes -----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/playlists", playlistRoutes);

// ----- 404 + error handler (must be LAST, in this order) -----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async() => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();