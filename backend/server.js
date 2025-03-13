import express from "express";
import cors from "cors";
import fs from 'graceful-fs'; // Import graceful-fs
import { connectDB } from "./config/db.js";
import projectRouter from "./routes/projectRoute.js";


// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());


// db connection
connectDB();


// api endpoints
app.use("/api/project", projectRouter)


app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});


// mongodb+srv://diananegut:<db_password>@jira-project.8emu9.mongodb.net/?