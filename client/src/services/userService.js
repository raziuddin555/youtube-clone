// services/userService.js
import api from "./api.js";

export const getHistory = () => api.get("/users/me/history");
export const addHistory = (videoId) => api.post(`/users/me/history/${videoId}`);
export const removeHistoryEntry = (videoId) => api.delete(`/users/me/history/${videoId}`);
export const clearHistory = () => api.delete("/users/me/history");

export const getWatchLater = () => api.get("/users/me/watch-later");
export const toggleWatchLater = (videoId) => api.post(`/users/me/watch-later/${videoId}`);

export const getDownloads = () => api.get("/users/me/downloads");
export const toggleDownload = (videoId) => api.post(`/users/me/downloads/${videoId}`);

export const getLikedVideos = () => api.get("/users/me/liked-videos");
export const getYourVideos = () => api.get("/users/me/videos");
export const getSubscriptionsFeed = () => api.get("/users/me/subscriptions");
export const getVideoSaveStatus = (videoId) => api.get(`/users/me/video-status/${videoId}`);