import mongoose from "mongoose";
import "dotenv/config";

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name  - Grab this from connect in online GUI for mongodb!
 */

const connection = mongoose.createConnection(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
});

// This Schema is for storing all OAuth2 accounts
// Do this so can use other providers e.g facebook etc.!!
const FederatedUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  }, // So can link the user id to federatedUserSchema!
  provider: String,
  subject: String,
});

const User = connection.model("User", UserSchema);
const FederatedUser = connection.model("FederatedUser", FederatedUserSchema);

// Expose the connection
export default connection;
