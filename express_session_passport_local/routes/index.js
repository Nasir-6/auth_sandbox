// const router = require("express").Router();
import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";

import passport from "passport";

// NEED TO IMPORT THE PASSPORT CONFIG!!!
import "../config/passport.js";

import { isValidPassword } from "../lib/passwordUtils.js";
import connection from "../config/database.js";
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 * i.e the functions when forms are submitted!!!
 */

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login-success",
    failureRedirect: "/login-failure",
  })
);

router.post("/register", async (req, res, next) => {
  console.log("req.body", req.body);
  console.log("req.body.pw", req.body.pw);
  const hashedPassword = await bcrypt.hash(req.body.pw, 10);

  const newUser = new User({
    username: req.body.uname,
    hashedPassword: hashedPassword,
  });

  newUser.save().then((user) => console.log("user", user));

  res.redirect("/login");
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

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
    );
  }
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/protected-route");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

export default router;
