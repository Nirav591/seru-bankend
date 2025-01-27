const express = require("express");
const { signup, login , getAllUsers , editUserRole } = require("../controllers/authController");

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);

// Admin routes (authentication/authorization middleware should be added here in production)
router.get("/users", getAllUsers);         // Get all users
router.put("/user/role", editUserRole);    // Edit user role

module.exports = router;
