import jwt from "jsonwebtoken";
import { db } from "./userHelper.js";

const mustBeSignedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      console.log(decoded);
      const user = await db.findByUsername(decoded.username);
      console.log(user);
      req.user = user;
    } else {
      res.json({ message: "token expired" });
    }
  } catch (err) {
    console.log(err);
  }

  return next();
};

const mustBeSignedOut = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    return res.status(403).json({ message: "You are already signed in" });
  }
  next();
};

export { mustBeSignedIn, mustBeSignedOut };
