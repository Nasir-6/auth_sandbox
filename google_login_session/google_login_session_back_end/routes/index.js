// const router = require("express").Router();
import { Router } from "express";
const router = Router();

import passport from "passport";

// NEED TO IMPORT THE PASSPORT CONFIG!!!
import "../config/passport.js";

router.get("/test", (req, res, next) => {
  console.log("TEST ROUTE");
  console.log("req.isAuthenticated()", req.isAuthenticated());
  res.send({ success: true, msg: "Test successfull" });
});

/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
router.get("/login/federated/google", passport.authenticate("google"));

const CLIENT_URL = "http://localhost:3000";

router.get("/get-logged-in-user", (req, res, next) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  } else {
    res.status(400).json({ success: false, msg: "No logged in user" });
  }
});

router.get("/login-fail", (req, res, next) => {
  res.status(401).json({
    success: false,
    msg: "Google login failed",
  });
});
/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successReturnToOrRedirect: CLIENT_URL,
    failureRedirect: "/login-fail",
  })
);

// Making a post req to this route logs the user out - new change!!!
// https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
router.post("/logout", (req, res, next) => {
  // New updated method!!
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(204).json({ success: true, msg: "Successfully logged out" });
  });
});

export default router;
