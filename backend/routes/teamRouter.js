import express from 'express';
import { 
    createTeam, 
    getAllTeams, 
    updateTeam, 
    deleteTeam, 
    addMemberToTeam, 
    removeMemberFromTeam , getTeamMembers,getTeamTasks,getTeamsByUserId, getUnassignedTeamTasks, assignTaskToUser
} from '../controllers/teamController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/', authMiddleware,createTeam);


router.get('/', authMiddleware, getAllTeams);

router.put('/:id', authMiddleware,updateTeam);


router.delete('/:id', authMiddleware,deleteTeam);

router.get('/:id/members', authMiddleware,getTeamMembers);


router.post('/:id/members/:memberId', authMiddleware,addMemberToTeam);

router.get('/:id/tasks', authMiddleware,getTeamTasks);

router.get('/user/:userId', authMiddleware,getTeamsByUserId);

router.get('/:id/unassigned-tasks', authMiddleware,getUnassignedTeamTasks);


router.delete('/:id/members/:memberId',authMiddleware, removeMemberFromTeam);

router.patch('/tasks/:taskId/assign/:userId',authMiddleware, assignTaskToUser);

export default router;