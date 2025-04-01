import express from 'express';
import { 
    createTeam, 
    getAllTeams, 
    updateTeam, 
    deleteTeam, 
    addMemberToTeam, 
    removeMemberFromTeam , getTeamMembers,getTeamTasks,getTeamsByUserId, getUnassignedTeamTasks, assignTaskToUser
} from '../controllers/teamController.js';

const router = express.Router();

router.post('/', createTeam);


router.get('/', getAllTeams);

router.put('/:id', updateTeam);


router.delete('/:id', deleteTeam);

router.get('/:id/members', getTeamMembers);


router.post('/:id/members/:memberId', addMemberToTeam);

router.get('/:id/tasks', getTeamTasks);

router.get('/user/:userId', getTeamsByUserId);

router.get('/:id/unassigned-tasks', getUnassignedTeamTasks);


router.delete('/:id/members/:memberId', removeMemberFromTeam);

router.patch('/tasks/:taskId/assign/:userId', assignTaskToUser);

export default router;