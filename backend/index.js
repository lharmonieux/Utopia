import express from "express";
import mongoose from "mongoose";
import actRoute from "./routes/actRoute.js";
import characterRoute from "./routes/characterRoute.js";
import cloudinaryRoute from "./routes/cloudinaryRoute.js";
import townRoute from "./routes/townRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import thematicRoute from "./routes/thematicRoute.js";
import answerTypeRoute from "./routes/answerTypeRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

export const __dirname = path.resolve();

const app = express();
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8080;

// Middleware for parsing request body
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
let corsOptions = {
  origin: process.env.URL_FRONT,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Routes admin
app.use("/acts", actRoute);
app.use("/characters", characterRoute);
app.use("/cloudinary", cloudinaryRoute);
app.use("/towns", townRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/thematic", thematicRoute);
app.use("/answer_type", answerTypeRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(
    "/*",
    (req, res) =>
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html")),
    function (error) {
      if (error) {
        res.status(500).send(error);
      }
    }
  );
} else {
  app.get("/", (req, res) => res.send("Api running"));
}

//Connection Database, Then running server
mongoose
  .connect(process.env.MONGO_DB_CONNECT)
  .then(() => {
    console.log("App connected to database");
    app.listen(port, () => {
      console.log(`App listened to port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
