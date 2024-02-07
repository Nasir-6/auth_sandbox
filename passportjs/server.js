const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const app = express();
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

// Acts as DB
const USERS = new Map();

// Acts as DB for all sessions
const SESSIONS = new Map();

app.post("/register", async (req, res) => {
  console.log("RESGITERING");

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

  const sessionId = String(Math.ceil(Math.random() * 1000));
  SESSIONS.set(sessionId, user);
  console.log("SESSIONS", SESSIONS);

  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    // secure = https
    // httpOnly (Can only access via http req - not via client JS)
    .send(`Registered as ${req.body.name} with email ${req.body.email} `);
});

app.post("/login", (req, res) => {
  console.log("test");
  const user = USERS.get(req.body.name);
  console.log("user", user);
  if (user === null) {
    res.sendStatus(401);
    return;
  }

  const sessionId = String(Math.ceil(Math.random() * 1000));
  SESSIONS.set(sessionId, user);
  console.log("SESSIONS", SESSIONS);

  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    // secure = https
    // httpOnly (Can only access via http req - not via client JS)
    .send(`Authed as ${req.body.username}`);
});

app.get("/adminData", (req, res) => {
  console.log("Session cookie", req.cookies);
  console.log("SESSIONS", SESSIONS);
  const user = SESSIONS.get(req.cookies.sessionId);
  console.log("user", user);
  if (user == null) {
    res.sendStatus(401);
    return;
  }

  if (user.role !== "Admin") {
    res.sendStatus(403);
    return;
  }

  res.send("Here is the admin Data!!!");
});

app.listen(3000, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 3000);
});
