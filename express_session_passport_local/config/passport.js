import passport from "passport";
import { Strategy } from "passport-local";
import connection from "./database.js";
import { isValidPassword } from "../lib/passwordUtils.js";
const User = connection.models.User;

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

// verifyCb takes in the username, password and done callback func
// Main thing is done is called the right way
// If Error - return done(err)
// If Password is wrong - return done(null, false)
// If password is correct - return done(null, user) - This user will be sent back to passport and attatched to cookie via the express-session and passport combo!
const verifyCb = (username, password, done) => {
  User.findOne({ username: username })
    .then(async (user) => {
      if (!user) return done(null, false);

      const isValid = await isValidPassword(password, user.hashedPassword);

      if (isValid) return done(null, user);
      return done(null, false);
    })
    .catch((err) => done(err));
};

const localStrategy = new Strategy(customFields, verifyCb);
passport.use(localStrategy);

// For detailed explanation of serializeUser and deserializeUser - https://youtu.be/fGrSmBk9v-4?si=rph-STR5bT_J5tTN
// This runs to store the user.id on a successfull login as the session data!
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// This runs on every request - whereby when it finds a user using the user.id (in session data) - it will attach the user obj to req.user
// Allows you to use the user object in subsequent requests!
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
