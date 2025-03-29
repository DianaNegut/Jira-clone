import express from 'express';
import { 
    createTeam, 
    getAllTeams, 
    updateTeam, 
    deleteTeam, 
    addMemberToTeam, 
    removeMemberFromTeam 
} from '../controllers/teamController.js';

const router = express.Router();

// Create a new team
router.post('/', createTeam);

// Get all teams
router.get('/', getAllTeams);

// Update team details
router.put('/:id', updateTeam);

// Delete a team
router.delete('/:id', deleteTeam);

// Add member to team
router.post('/:id/members/:memberId', addMemberToTeam);

// Remove member from team
router.delete('/:id/members/:memberId', removeMemberFromTeam);

export default router;