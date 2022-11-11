import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

import connectDB from "./config/db";
import routesList from "./routes";

connectDB();

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend working c:");
});

for (const { name, router } of routesList) {
  app.use(`/api/${name}`, router);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("running on port", PORT));
