import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import connection from "./database.js";
const User = connection.models.User;
const FederatedUser = connection.models.FederatedUser;

// verifyCb takes in the payload and done callback func
// Main thing is calling the "done" function the right way
// If Error - return done(err)
// If Password is wrong - return done(null, false)
// If password is correct - return done(null, user) - This user will be sent back to passport and attatched to cookie via the express-session and passport combo!
const verifyCb = (accessToken, refreshToken, profile, done) => {
  console.log("profile", profile);
  // This runs once all the google auth is done and profile is recieved
  FederatedUser.findOne({
    subject: profile.id,
    provider: "https://accounts.google.com",
  }) // !IMPORTANT use subject - as that is what is linked to profile
    .then(async (federated_user) => {
      // No federated_user
      if (!federated_user) {
        // Then create a mongodb user
        const newUser = await User.create({
          username: profile.displayName,
        });
        // create a federatedUser with the newUser._id
        const newFederatedUser = await FederatedUser.create({
          user: newUser._id,
          subject: profile.id,
          provider: "https://accounts.google.com",
        });

        return done(null, newUser); // return newUser!!
      } else {
        // found a federated_user - now return the user in db linked to it!!

        return User.findOne({
          _id: federated_user.user,
        })
          .then((userInDb) => {
            return done(null, userInDb);
          })
          .catch((err) => done(err));
      }
    })
    .catch((err) => done(err));
};

const options = {
  clientID: process.env["GOOGLE_CLIENT_ID"],
  clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
  callbackURL: "/oauth2/redirect/google",
  scope: ["profile"],
  state: true,
};

const googleStrategy = new GoogleStrategy(options, verifyCb);
passport.use(googleStrategy);

// Configure Passport authenticated session persistence!!!!!
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
