// services/videoService.js
import api from "./api.js";

export const getVideos = (params) => api.get("/videos", { params }); // params: { search, category }
export const getVideoById = (id) => api.get(`/videos/${id}`);
export const createVideo = (payload) => api.post("/videos", payload);
export const updateVideo = (id, payload) => api.put(`/videos/${id}`, payload);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
export const likeVideo = (id) => api.post(`/videos/${id}/like`);
export const dislikeVideo = (id) => api.post(`/videos/${id}/dislike`);