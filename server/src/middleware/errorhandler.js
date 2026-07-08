// server/src/middleware/errorHandler.js
// Phase 1 ticket. Catches errors thrown/passed via next(err) from any controller.
// Keeps controllers free of repetitive try/catch error-shaping logic.

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Server error",
        // Stack traces only leak in non-production environments.
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};