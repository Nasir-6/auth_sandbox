const isAdmin = (req, res, next) => {
  // Utilising passport.js .isAuthenticated() method which is attached to each req
  // Also utilising our own isAdmin flag!!
  if (req.isAuthenticated() && req.user.isAdmin) {
    next(); // Send back next so can continue in authed route!!
  } else {
    res.status(401).json({ msg: "You are not authenticated as an Admin!" });
  }
};

export default isAdmin;
