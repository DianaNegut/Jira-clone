import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Company name
  planType: { 
    type: String, 
    required: true, 
    enum: ['Basic Plan', 'Standard Plan', 'Premium Plan', 'Enterprise Plan'] // Based on the image
  },
  paymentFrequency: { 
    type: String, 
    required: true, 
    enum: ['monthly', 'annually'] 
  },
  startDate: { type: Date, required: true }, // Date when the plan started
  expirationDate: { type: Date, required: true }, // Next payment or expiration date
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: false,
    },
  ],
}, { minimize: false, timestamps: true });

const companyModel = mongoose.models.Company || mongoose.model('Company', companySchema, 'companies');
export default companyModel;