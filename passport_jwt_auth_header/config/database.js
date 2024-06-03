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
  hashedPassword: String,
  isAdmin: Boolean,
});

const User = connection.model("User", UserSchema);

// Expose the connection
export default connection;
