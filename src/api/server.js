import express, {json} from "express";

const app = express();
import {config} from "dotenv"
import cors from "cors";

config();

// Cors
let corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Database Connections
import db from "../config/mongodb.js";

db.databaseConnection();

// Import Routes
import AuthRoute from "./routes/AuthRoute.js";

// BodyParser Middleware
app.use(json());

// Routes
app.use("/api/auth", AuthRoute);

app.listen(3000);

export default app;