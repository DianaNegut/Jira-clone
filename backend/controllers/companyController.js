import companyModel from '../models/companyModel.js';
import teamModel from '../models/teamModel.js';

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find().populate('teams');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id).populate('teams');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCompany = async (req, res) => {
  const { name, planType, paymentFrequency, startDate, expirationDate, teams } = req.body;

  try {

    const validTeams = await teamModel.find({ _id: { $in: teams } });
    if (teams && teams.length !== validTeams.length) {
      return res.status(400).json({ message: 'One or more team IDs are invalid' });
    }

    const company = new companyModel({
      name,
      planType,
      paymentFrequency,
      startDate,
      expirationDate,
      teams,
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, planType, paymentFrequency, startDate, expirationDate, teams } = req.body;
    const company = await companyModel.findById(req.params.id);

    if (!company) return res.status(404).json({ message: 'Company not found' });


    if (teams) {
      const validTeams = await teamModel.find({ _id: { $in: teams } });
      if (teams.length !== validTeams.length) {
        return res.status(400).json({ message: 'One or more team IDs are invalid' });
      }
    }

    company.name = name || company.name;
    company.planType = planType || company.planType;
    company.paymentFrequency = paymentFrequency || company.paymentFrequency;
    company.startDate = startDate || company.startDate;
    company.expirationDate = expirationDate || company.expirationDate;
    company.teams = teams || company.teams;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await companyModel.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};