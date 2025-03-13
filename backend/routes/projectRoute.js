import express from 'express'
import { addProject } from '../controllers/projectController.js'
import multer from "multer"

const projectRouter = express.Router();

// Image Storage engine
projectRouter.post("/add", addProject);

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req, file, cb)=>{
        return cb(null,`${Date.now()}`)
    }
})



export default projectRouter;