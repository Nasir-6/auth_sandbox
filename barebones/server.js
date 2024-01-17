const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(cookieParser());

// Acts as DB
const USERS = new Map();
USERS.set("admin", { id: 1, username: "admin", role: "Admin" });
USERS.set("user", { id: 2, username: "user", role: "User" });

// Acts as DB for all sessions
const SESSIONS = new Map();

app.post("/login", (req, res) => {
  console.log("test");
  const user = USERS.get(req.body.username);
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
