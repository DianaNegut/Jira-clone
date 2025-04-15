import express from 'express';
import { 
    addTask, 
    getTasks, 
    getTaskById, 
    updateTask, 
    deleteTask, 
    getTasksByUser, 
    uploadTaskFiles,getTeamTasksNew,
    addTimeToTask , getTaskByTitle,addCommentToTask, getCommentsForTask ,getTeamTasksByName,getTasksByCompanyName, getTaskCountByCompanyName
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.post("/add",authMiddleware, addTask);
taskRouter.get('/teams/:teamId/tasks', authMiddleware,getTeamTasksNew);
taskRouter.get('/teams/:teamName/tasks', authMiddleware, getTeamTasksByName);

taskRouter.get("/user/:userId", authMiddleware,getTasksByUser);
taskRouter.get("/",authMiddleware, getTasks);
taskRouter.get("/:id", authMiddleware,getTaskById);
taskRouter.put("/:id",authMiddleware, updateTask);
taskRouter.delete("/:id", authMiddleware,deleteTask);
taskRouter.post("/:id/upload", authMiddleware,uploadTaskFiles);
taskRouter.post("/:id/add-time",authMiddleware, addTimeToTask); 
taskRouter.get("/title/:title", authMiddleware,getTaskByTitle);
taskRouter.post("/:taskId/comments", authMiddleware, addCommentToTask);
taskRouter.get("/:taskId/comments",authMiddleware, getCommentsForTask);
taskRouter.get("/company/:companyName", getTasksByCompanyName);
taskRouter.get("/company/:companyName/count", authMiddleware, getTaskCountByCompanyName);

export default taskRouter;