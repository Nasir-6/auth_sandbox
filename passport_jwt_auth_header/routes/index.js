// const router = require("express").Router();
import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";

import passport from "passport";

// NEED TO IMPORT THE PASSPORT CONFIG!!!
import "../config/passport.js";

import connection from "../config/database.js";
import { issueJWT } from "../lib/issueJWT.js";
import { isValidPassword } from "../lib/passwordUtils.js";
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 * i.e the functions when forms are submitted!!!
 */

router.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.uname }).then((user) => {
    if (!user) {
      res.status(401).json({ success: false, msg: "Could not find user" }); //!Important - Normally would not say this (To avoid specifying) - rather should say details are incorrect
    }

    const isValid = isValidPassword(req.body.pw, user.hashedPassword);

    if (isValid) {
      const jwt = issueJWT(user);
      res
        .status(200)
        .json({ success: true, token: jwt.token, expiresIn: jwt.expires });
    } else {
      res.status(401).json({ success: false, msg: "Password is incorrect" }); //!Important - Normally would not say this (To avoid specifying) - rather should say details are incorrect
    }
  });
});

router.post("/register", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.pw, 10);

  const newUser = new User({
    username: req.body.uname,
    hashedPassword: hashedPassword,
    isAdmin: true,
  });

  newUser.save().then((user) => {
    const jwt = issueJWT(user);

    console.log("jwt", jwt);
    console.log("user", user);
    res.json({
      success: true,
      user: user, // Not sure if we want to send this!!
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  });

  // res.redirect("/login");
});

/**
 * -------------- GET ROUTES ----------------
 * These are the HTML forms - notice how the form has method and action
 * This links to the post methods above!
 */

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  // !Important note: Notice the name for each input - "uname"/"pw" - these are the body names we need to use in the server!! - this was done to make it clear!!
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// Use custom isAuth middleware - to check first
router.get(
  "/protected-route",
  passport.authenticate("jwt", { session: false }), // !Note: Once logged in and jwt is issued will use this to autheticate using the jwt
  (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are authorised!" });
  }
);

// Visiting this route logs the user out - new change!!!
// https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
router.get("/logout", (req, res, next) => {
  // OLD METHOD - not working anymore !!!
  //   req.logout(); // .logout is attached method by passport once logged in!
  //   res.redirect("/protected-route");

  // New updated method!!
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/protected-route");
  });
});

router.get("/login-success", (req, res, next) => {
  res.send(
    `<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>\
    `
    // <br>
    // OR <a href="/admin-route">Go to Admin route</a>
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

export default router;
