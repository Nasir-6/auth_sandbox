const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

// Express session manages the cookies and sessions - you will need to setup a db so can store all the info
// But can use req.session to store things
// When you adjust req.session  e.g do req.session.somethingToStore = "something"
// It will auto send a cookie back to client - creating a connect.sid (which is the session id)!!
// This saves us from having to manually manage sessions etc.!!
app.use(
  session({
    secret: "SOME SECRET TO ENCRYPT COOKIE", // Would store this in env vars!
    resave: false, // Do we want to resave session vars if nothing changed - no
    saveUninitialized: false, // Do we want to save an empty value when there is no session?
    cookie: {
      // SameSite: "none", // DON'T INCLUDE sameSite: "none" prevents express cookies from being saved unless secure is set - but then need https - which isn't on dev!!!
      // https://stackoverflow.com/questions/76354210/why-is-my-express-session-cookie-being-sent-by-api-but-not-picked-up-in-browser
      httpOnly: false,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

// Acts as DB - need this to securely store more info about users e.g passwords etc.
const USERS = new Map();

app.post("/register", async (req, res) => {
  console.log("REGISTERING");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (USERS.has(req.body.email))
    res.status(400).send("There is a user with this email already");

  const user = {
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };

  USERS.set(user.email, user);

  console.log("USERS", USERS);

  res.send(`Registered as ${req.body.name} with email ${req.body.email} `);
});

app.post("/login", (req, res) => {
  if (req.body.email === req.session.email)
    res.status(400).send(`Already logged in as ${req.body.email}`);

  const user = USERS.get(req.body.email);
  if (!user)
    res.status(401).send(`No such user exists with email ${req.body.email}`);

  //TODO: Check password is the same
  req.session.email = user.email;

  res.send(`Authed as ${user.name}`);
});

// TODO: Add an authorised route to get all info for dashboard

app.listen(3000, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 3000);
});
