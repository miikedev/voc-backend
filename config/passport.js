const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user.model")

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return done(null, false, { message: "Incorrect email." })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." })
        }

        return done(null, user)
      } catch (err) {
        console.error("Passport Local Strategy Error:", err)
        return done(err)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (err) {
    console.error("Serialize User Error:", err)
    done(err)
  }
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      return done(null, false)
    }
    done(null, user)
  } catch (err) {
    console.error("Deserialize User Error:", err)
    done(err)
  }
})

module.exports = passport

