import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const emailExists = await User.findOne({ email: trimmedEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const usernameExists = await User.findOne({
      username: { $regex: new RegExp("^" + trimmedUsername.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
    });

    await user.save();

    // Sign Token
    const payload = { id: user._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "doddleDocsSecretKeySecure123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedInput = emailOrUsername.trim();

    // Find by email or username (case-insensitive username search)
    let user = await User.findOne({
      $or: [
        { email: trimmedInput.toLowerCase() },
        { username: { $regex: new RegExp("^" + trimmedInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") } },
      ],
    });

    // Auto-create dummy user kai/k41 if not found in database
    if (!user && (trimmedInput.toLowerCase() === "kai" && password === "k41")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("k41", salt);
      user = new User({
        username: "kai",
        email: "kai@doddledocs.com",
        password: hashedPassword,
      });
      await user.save();
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign Token
    const payload = { id: user._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "doddleDocsSecretKeySecure123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user details
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Fetch profile error:", error.message);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update username and email
// @access  Private
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email taken by another account
    if (trimmedEmail !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: trimmedEmail });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already registered by another account" });
      }
      user.email = trimmedEmail;
    }

    // Check if username taken by another account
    if (trimmedUsername !== user.username) {
      const usernameExists = await User.findOne({
        username: { $regex: new RegExp("^" + trimmedUsername.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
      });
      if (usernameExists) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      user.username = trimmedUsername;
    }

    await user.save();

    // Re-sign Token
    const payload = { id: user._id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "doddleDocsSecretKeySecure123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error updating profile details" });
  }
});

// @route   PUT /api/auth/password
// @desc    Update password securely
// @access  Private
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Server error updating account password" });
  }
});

export default router;
