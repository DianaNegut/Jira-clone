import express from 'express';
import { 
  getAllCompanies, 
  getCompanyById, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from '../controllers/companyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const companyRouter = express.Router();

companyRouter.get('/companies',authMiddleware, getAllCompanies);
companyRouter.get('/companies/:id',authMiddleware, getCompanyById);
companyRouter.post('/companies', authMiddleware,createCompany);
companyRouter.put('/companies/:id', authMiddleware,updateCompany);
companyRouter.delete('/companies/:id',authMiddleware, deleteCompany);

export default companyRouter;