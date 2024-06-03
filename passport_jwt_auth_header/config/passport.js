import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import connection from "./database.js";
import { isValidPassword } from "../lib/passwordUtils.js";
const User = connection.models.User;
import fs from "fs";

import path from "path";
import getDirname from "../lib/getDirname.js";

// Use the helper function to get __dirname
const __dirname = getDirname(import.meta);
// Construct the path to the public key file
const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
// Read the public key file
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ["RS256"],
  secretOrKey: PUB_KEY,
  // secretOrKey is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's signature.
  // REQUIRED unless secretOrKeyProvider is provided.
  // If you're using symmetric - just add a secret string e.g "someSecret"
  // But we are using asymmetric (Pub/Priv keys) - so can sign adn authenticate using Private keys - but Pub keys can only verify!
};

// verifyCb takes in the payload and done callback func
// Main thing is calling the "done" function the right way
// If Error - return done(err)
// If Password is wrong - return done(null, false)
// If password is correct - return done(null, user) - This user will be sent back to passport and attatched to cookie via the express-session and passport combo!
const verifyCb = (payload, done) => {
  // !Note: Don't need to check password here - as we are using the JWT to authorise
  // jwt strategy deals with validating the token is not forged etc. - but here we are checking if we have the user via the sub id - to attatch to the req.user prop
  User.findOne({ _id: payload.sub }) // !IMPORTANT use _id - that is the id for mongodb user!!!
    .then(async (user) => {
      // No user
      if (!user) return done(null, false);
      // Found user!
      return done(null, user);
    })
    .catch((err) => done(err));
};

const jwtStrategy = new Strategy(jwtOptions, verifyCb);
passport.use(jwtStrategy);

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
