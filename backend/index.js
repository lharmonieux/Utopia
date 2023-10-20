import express from "express";
import mongoose from "mongoose";
import actRoute from "./routes/actRoute.js";
import personnageRoute from "./routes/personnageRoute.js";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
dotenv.config({
    path: "./.env"
});

const port =  process.env.PORT;

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
let corsOptions = {
    origin: process.env.URL_FRONT,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Routes admin
app.use('/acts', actRoute);
app.use('/personnages', personnageRoute);

//Connection Database, Then running server
mongoose
    .connect(process.env.MONGO_DB_CONNECT)
    .then(() => {
        console.log("App connected to database");
        app.listen(port, () => {
            console.log(`App listened to port: ${port}`);
        })
    })
    .catch( error => {
        console.error(error);
    })

