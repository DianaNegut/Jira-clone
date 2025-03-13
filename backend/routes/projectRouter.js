import express from 'express';
import { addProject } from '../controllers/projectController.js';
import multer from "multer";
import fs from 'graceful-fs';

const projectRouter = express.Router();

// Image Storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

projectRouter.post("/add", upload.single("image"), addProject); // Ensure "image" matches the field name

export default projectRouter;