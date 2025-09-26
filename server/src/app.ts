import express from "express";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";
import sweetsRoutes from "./routes/sweets.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/cart", cartRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
