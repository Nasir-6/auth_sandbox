const isAuth = (req, res, next) => {
  // Utilising passport.js .isAuthenticated() method which is attached to each req
  if (req.isAuthenticated()) {
    next(); // Send back next so can continue in authed route!!
  } else {
    res.status(401).json({ msg: "You are not authenticated!" });
  }
};

export default isAuth;
