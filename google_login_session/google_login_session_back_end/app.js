import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";

import router from "./routes/index.js";
import connection from "./config/database.js";

// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from "connect-mongo";

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
import "dotenv/config.js";

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import cors from "cors";
import cookieParser from "cookie-parser";
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
  client: connection.getClient(),
  collectionName: "google-sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 3, // 3 mins
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize()); // NOte needed anymore!!???
app.use(passport.session()); // Same as app.use(passport.authenticate('session'));

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(router);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:8080
const PORT = 8080;
app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
