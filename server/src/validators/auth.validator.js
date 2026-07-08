// server/src/validators/auth.validator.js
// express-validator chains for register/login. Maps directly to rubric:
// "Apply proper validation (username, email, password) to all input fields
// and display relevant error messages on the UI."
// Phase 2 ticket: TICKET-BE-01

import { body } from "express-validator";

export const validateRegister = [
    body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
    body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
    body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
    body("password")
    .notEmpty()
    .withMessage("Password is required"),
];