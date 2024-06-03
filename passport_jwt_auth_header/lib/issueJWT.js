import jwt from "jsonwebtoken";
import getDirname from "./getDirname.js";

import fs from "fs";
import path from "path";

// !NOTE: We use the private key to issue token!!
const __dirname = getDirname(import.meta);
const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

export const issueJWT = (user) => {
  const _id = user._id;
  const expiresIn = "1d"; // This the convention used by jsonwebtoken - https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken, // We are using ExtractJwt.fromAuthHeaderAsBearerToken() - so must be in this exact format!!
    expires: expiresIn,
  };
};
