import express from 'express';
import { 
  createActivitate, 
  getAllActivitati, 
  getActivitateById, 
  updateActivitate, 
  deleteActivitate 
} from '../controllers/activitateController.js';

const activitateRouter = express.Router();


activitateRouter.post('/create', createActivitate);


activitateRouter.get('/', getAllActivitati);


activitateRouter.get('/:id', getActivitateById);


activitateRouter.put('/:id', updateActivitate);


activitateRouter.delete('/:id', deleteActivitate);

export default activitateRouter;
