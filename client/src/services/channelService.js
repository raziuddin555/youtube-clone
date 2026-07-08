// services/channelService.js
import api from "./api.js";

export const createChannel = (payload) => api.post("/channels", payload);
export const getChannelById = (id) => api.get(`/channels/${id}`);
export const updateChannel = (id, payload) => api.put(`/channels/${id}`, payload);
export const toggleSubscribe = (id) => api.post(`/channels/${id}/subscribe`);