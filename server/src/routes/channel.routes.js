// server/src/routes/channel.routes.js
// POST   /api/channels                  (protected) create channel
// GET    /api/channels/:id              fetch channel info + its videos
// PUT    /api/channels/:id              (protected) edit channel
// POST   /api/channels/:id/subscribe    (protected) toggle subscribe
// Phase 2 ticket: TICKET-BE-03

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createChannel, getChannelById, updateChannel, toggleSubscribe } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/:id", getChannelById);
router.put("/:id", protect, updateChannel);
router.post("/:id/subscribe", protect, toggleSubscribe);

export default router;