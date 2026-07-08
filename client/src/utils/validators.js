// utils/validators.js — client-side field validation, mirrors backend rules.
// Rubric: "Apply proper validation... display relevant error messages on the UI."
// Phase 3 ticket: TICKET-FE-02

export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    return typeof password === "string" && password.length >= 6;
}

export function validateUsername(username) {
    return typeof username === "string" && username.trim().length >= 3;
}