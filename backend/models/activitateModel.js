import mongoose from "mongoose";


const activitateSchema = new mongoose.Schema({
  mesaj: {
    type: String,
    required: true, 
    trim: true,     
  },
  task: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tasks", 
    required: true, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true, 
  minimize: false,  
});


const activitateModel = mongoose.models.Activitate || mongoose.model("Activitate", activitateSchema);

export default activitateModel;