import express from "express";
import cors from "cors";
import fs from 'graceful-fs';
import { connectDB } from "./config/db.js";
import projectRouter from "./routes/projectRouter.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRouter.js";
import teamRouter from "./routes/teamRouter.js";
import activitateRouter from "./routes/activitateRouter.js";
import companyRouter from "./routes/companyRouter.js";
import 'dotenv/config';
import { authMiddleware } from './middleware/authMiddleware.js'; 

const app = express();
const port = 4000;


app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use("/api/user", userRouter)



app.use("/images", express.static("uploads"));


connectDB();


app.use("/api/project", projectRouter);
app.use("/api/company",companyRouter)
app.use("/api/task", taskRouter);
app.use("/api/teams", teamRouter);
app.use("/api/activitate", activitateRouter);


app.delete('/test-delete', (req, res) => {
    res.json({ message: 'DELETE request received successfully' });
});

app.get("/", (req, res) => {
    res.send("API Working");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
