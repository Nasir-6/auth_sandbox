// nasirislam
// VGdwXl1VksPyRU5r MONGO.DB PWD
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";

// var crypto = require("crypto");
import router from "./routes/index.js";
import connection from "./config/database.js";

// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from "connect-mongo";

// const MongoStore = require("connect-mongo")(session);

// Need to require the entire Passport config module so app.js knows about it
// require("./config/passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
import "dotenv/config";

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
  client: connection.getClient(),
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
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
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(router);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
