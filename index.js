const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("./config/passport")
const authRoute = require("./routes/auth.route")
const newsRoute = require("./routes/news.route")
require("dotenv").config()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-fallback-secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newsPlatform",
        dbName: "newsPlatform", // Optional, if needed
        collectionName: "sessions",
        ttl: 24 * 60 * 60, // 1 day
        autoRemove: "native",
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    })
  );

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/auth", authRoute)
app.use("/api/news", newsRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  })
})

const start = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB!")
    await app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`)
    })
  } catch (err) {
    console.error("Error starting server:", err)
    process.exit(1)
  }
}
start()
module.exports = app

