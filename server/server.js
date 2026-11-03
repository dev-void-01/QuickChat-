import "dotenv/config";
import express from "express";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import { getJwtSecret } from "./lib/jwtSecret.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

getJwtSecret();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: true, credentials: true }));

app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;

await connectDB();
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
