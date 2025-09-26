import mongoose from "mongoose";
import { env } from "./config/env.js";
import app from "./app.js";

(async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(env.PORT, () =>
      console.log(`API running at http://localhost:${env.PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
