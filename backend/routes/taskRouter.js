import express from 'express';
import { 
    addTask, 
    getTasks, 
    getTaskById, 
    updateTask, 
    deleteTask, 
    getTasksByUser, 
    uploadTaskFiles,
    addTimeToTask , getTaskByTitle
} from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.post("/add", addTask);
taskRouter.get("/user/:userId", getTasksByUser);
taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.post("/:id/upload", uploadTaskFiles);
taskRouter.post("/:id/add-time", addTimeToTask); 
taskRouter.get("/title/:title", getTaskByTitle);


export default taskRouter;