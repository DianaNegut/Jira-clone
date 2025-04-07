import express from 'express';
import { addProject } from '../controllers/projectController.js';
import multer from "multer";
import fs from 'graceful-fs';

const projectRouter = express.Router();


const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

projectRouter.post("/add", upload.single("image"), addProject); 

export default projectRouter;