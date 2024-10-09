import jwt from "jsonwebtoken";
import User from "../models/User.js";

import asyncHandler from "./asyncHandler.js";

// is user authenticated or not

const authenticated = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId.select("-password"));
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorized, no token found");
    }
  } else {
    res.status(401);
    throw new Error("No Token, not authorized");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not Authorized as an admin");
  }
};

export { authenticated, authorizeAdmin };
