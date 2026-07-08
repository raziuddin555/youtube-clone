// server/src/middleware/notFound.js
// Phase 1 ticket. Catches requests to undefined routes.

export const notFound = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};