const User = require("../models/user.model")
const passport = require("passport")

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    })

    await user.save()

    // Log in the user after registration
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in after registration", error: err.message })
      }

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    })
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    })
  }
}

// Login user
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Error logging in", error: err.message })
    }

    if (!user) {
      return res.status(401).json({ message: info.message || "Invalid credentials" })
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in", error: err.message })
      }

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    })
  })(req, res, next)
}

// Logout user
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out", error: err.message })
    }
    res.json({ message: "Logged out successfully" })
  })
}

// Get current user
exports.getCurrentUser = (req, res) => {
  res.json({
    user: req.user
      ? {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
        }
      : null,
  })
}

