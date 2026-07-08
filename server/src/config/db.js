// server/src/config/db.js
// Single responsibility: connect to MongoDB Atlas (or local) via Mongoose.
// Phase 1 ticket.

import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};