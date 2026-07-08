// constants/categories.js
// Single source of truth for video categories on the frontend.
// MUST stay in sync with the `category` enum in server/src/models/Video.model.js —
// if you add a category here, add it there too, or the filter will silently
// match zero videos.

export const CATEGORIES = [
    "Web Development",
    "JavaScript",
    "Data Structures",
    "Music",
    "Gaming",
    "Education",
];