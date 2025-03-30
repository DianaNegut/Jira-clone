import express from 'express';
import { 
    createTeam, 
    getAllTeams, 
    updateTeam, 
    deleteTeam, 
    addMemberToTeam, 
    removeMemberFromTeam , getTeamMembers,getTeamTasks,getTeamsByUserId
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


router.delete('/:id/members/:memberId', removeMemberFromTeam);

export default router;