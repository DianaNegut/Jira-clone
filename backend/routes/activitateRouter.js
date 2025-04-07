import express from 'express';
import { 
  createActivitate, 
  getAllActivitati, 
  getActivitateById, 
  updateActivitate, 
  deleteActivitate 
} from '../controllers/activitateController.js';

const activitateRouter = express.Router();


activitateRouter.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const activitati = await activitateModel
      .find({ task: taskId })
      .populate("user", "nume email")
      .populate("task", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json(activitati);
  } catch (error) {
    console.error("Eroare la obținerea activităților:", error);
    res.status(500).json({ error: error.message });
  }
});


activitateRouter.post('/create', createActivitate);


activitateRouter.get('/', getAllActivitati);


activitateRouter.get('/:id', getActivitateById);


activitateRouter.put('/:id', updateActivitate);


activitateRouter.delete('/:id', deleteActivitate);

export default activitateRouter;
