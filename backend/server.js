import express from "express";
import cors from "cors";
import fs from 'graceful-fs'; 
import { connectDB } from "./config/db.js";
import projectRouter from "./routes/projectRouter.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRouter.js";
import teamRouter from "./routes/teamRouter.js";
import 'dotenv/config'

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/project", projectRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/teams", teamRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});