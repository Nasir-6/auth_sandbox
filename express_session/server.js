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
      // TODO: Some reading - https://web.dev/articles/samesite-cookies-explained
      // I think default value of sameSite is lax if not set!
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
    return res.status(400).send("There is a user with this email already");

  const user = {
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };

  USERS.set(user.email, user);

  console.log("USERS", USERS);

  return res.send(
    `Registered as ${req.body.name} with email ${req.body.email} `
  );
});

app.post("/login", async (req, res) => {
  if (req.body.email === req.session.email)
    return res.status(400).send(`Already logged in as ${req.body.email}`);
  console.log("NEW LOGING");
  const user = USERS.get(req.body.email);
  console.log(user);
  console.log("!user", !user);
  if (!user) {
    return res
      .status(401)
      .send(`No such user exists with email ${req.body.email}`);
  }

  console.log("USER EXISTS");
  //TODO: Check password is the same
  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isCorrectPassword)
    return res.status(400).send(`email/password is incorrect`);
  // IMPORTANT NOTE: It not good practice so send a message saying that specifically the password is incorrect - but here we are doing so more for testing/demo purposes
  // In an actual application you would be as vague as possible - not saying if email exists or not etc.!
  console.log("PASSWORD MATCHED");
  req.session.email = user.email;

  return res.send(`Authed as ${user.name}`);
});

// IMPORTANT NOTE: res.send() doesn't exit the function - so needed return (return res.send() is return undefined)
// Other ways would be use next() - to move to next middleware
// Or use res.end() - to stop it completely but not move to the next middleware
// Here I just used return to keep it simple
// https://www.geeksforgeeks.org/how-to-exit-after-res-send-in-express-js/

// TODO: Add an authorised route to get all info for dashboard

// TODO: Add logout - remove cookie!!

app.listen(3000, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 3000);
});
