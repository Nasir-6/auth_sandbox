import passport from "passport";
import { LocalStrategy } from "passport-local";
import connection from "./database";
const User = connection.models.User;

// TODO: passport.use();
