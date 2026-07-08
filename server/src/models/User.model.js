// server/src/models/User.model.js
// Maps to rubric sample data: userId, username, email, password(hashed), avatar, channels[]
// Phase 2 ticket: TICKET-BE-01

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // store bcrypt hash only, never plaintext
    avatar: { type: String, default: "" },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],

    // ── Personal library ──────────────────────────────────────────────
    // Kept here (not on Video, unlike likes/dislikes) because the natural
    // query for all of these is "give me MY list" — a single populated
    // array read beats scanning every Video for a match.
    watchHistory: [{
        video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
        watchedAt: { type: Date, default: Date.now },
    }, ],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    // No real file download happens anywhere in this app — this is a
    // saved/offline-marked list, same shape as watchLater, not actual bytes.
    downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    subscribedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
}, { timestamps: true });

// Hash the password automatically right before saving — but ONLY if it changed.
// Without the isModified check, updating a user's username would re-hash an
// already-hashed password and silently break their login.

// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method used during login to check a plaintext password against the hash.
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Strip the password hash out of any JSON response, automatically, everywhere.
// This means controllers never have to remember to delete it manually.
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

export default mongoose.model("User", userSchema);