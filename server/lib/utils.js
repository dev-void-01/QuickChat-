import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtSecret.js";

export const generateToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), { expiresIn: "30d" });
