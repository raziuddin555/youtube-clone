// services/authService.js
// TICKET-FE-01

import api from "./api.js";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);

// Verifies the stored JWT and returns the logged-in user's profile.
// Called by AuthContext on mount to rehydrate user state after a page refresh.
export const getMe = () => api.get("/auth/me");