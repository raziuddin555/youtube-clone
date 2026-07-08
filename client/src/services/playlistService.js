// services/playlistService.js
import api from "./api.js";

export const getMyPlaylists = () => api.get("/playlists");
export const createPlaylist = (name) => api.post("/playlists", { name });
export const getPlaylistById = (id) => api.get(`/playlists/${id}`);
export const renamePlaylist = (id, name) => api.put(`/playlists/${id}`, { name });
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`);
export const addVideoToPlaylist = (id, videoId) => api.post(`/playlists/${id}/videos/${videoId}`);
export const removeVideoFromPlaylist = (id, videoId) => api.delete(`/playlists/${id}/videos/${videoId}`);