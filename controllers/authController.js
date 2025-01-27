const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const { email, password, confirmPassword, role } = req.body;

    // Validation
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if email already exists
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [
            email,
            hashedPassword,
            role || "user", // Default role is "user"
        ]);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Check if user exists
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, 'seru', {
            expiresIn: "1h",
        });

        // Return response with role
        res.json({
            message: "Login successful",
            token,
            role: user.role,  // Include role in the response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, email, role, created_at FROM users");
        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Edit user role (Admin only)
exports.editUserRole = async (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ error: "User ID and role are required" });
    }

    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        // Check if user exists
        const [userRows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user role
        await db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);

        res.json({ message: "User role updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
