// hooks/useAuth.js — convenience hook to consume AuthContext.
// Phase 3 ticket: TICKET-FE-01

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export const useAuth = () => useContext(AuthContext);