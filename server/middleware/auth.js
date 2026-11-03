import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getJwtSecret } from "../lib/jwtSecret.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
