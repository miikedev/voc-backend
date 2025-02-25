// Check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
      return next()
    }
    res.status(401).json({ message: "You must be logged in to access this resource" })
  }
  
  // Check if the user is NOT authenticated
  exports.isNotAuthenticated = (req, res, next) => {
    if (!req.user) {
      return next()
    }
    res.status(403).json({ message: "You are already logged in" })
  }