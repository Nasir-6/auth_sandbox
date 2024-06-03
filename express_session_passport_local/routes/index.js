// const router = require("express").Router();
import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";

import passport from "passport";

// NEED TO IMPORT THE PASSPORT CONFIG!!!
import "../config/passport.js";

import connection from "../config/database.js";
import isAuth from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
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
  const hashedPassword = await bcrypt.hash(req.body.pw, 10);

  const newUser = new User({
    username: req.body.uname,
    hashedPassword: hashedPassword,
    isAdmin: true,
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
router.get("/protected-route", isAuth, (req, res, next) => {
  res.send(
    '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send(
    '<h1>You are authenticated as an ADMIN!</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

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
    <br>
    OR <a href="/admin-route">Go to Admin route</a>
    `
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

export default router;
