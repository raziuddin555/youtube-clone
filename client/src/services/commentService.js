// services/commentService.js
import api from "./api.js";

export const getCommentsForVideo = (videoId) => api.get(`/comments/video/${videoId}`);
export const addComment = (payload) => api.post("/comments", payload); // { video, text }
export const updateComment = (id, payload) => api.put(`/comments/${id}`, payload);
export const deleteComment = (id) => api.delete(`/comments/${id}`);