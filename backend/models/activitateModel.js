import mongoose from "mongoose";

// Definiția schemei pentru modelul Activitate
const activitateSchema = new mongoose.Schema({
  mesaj: {
    type: String,
    required: true, // Mesajul activității este obligatoriu
    trim: true,     // Elimină spațiile inutile de la început și sfârșit
  },
  task: {
    type: mongoose.Schema.Types.ObjectId, // Referință către un task
    ref: "Tasks", // Numele modelului Task (asigură-te că există)
    required: true, // Referința către task este obligatorie
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Referință către un user
    ref: "User", // Numele modelului User (asigură-te că există)
    required: true, // Referința către user este obligatorie
  },
  createdAt: {
    type: Date,
    default: Date.now, // Data creării activității, implicit este data curentă
  },
}, {
  timestamps: true, // Adaugă automat createdAt și updatedAt
  minimize: false,  // Permite câmpuri goale
});

// Creează modelul dacă nu există deja
const activitateModel = mongoose.models.Activitate || mongoose.model("Activitate", activitateSchema);

export default activitateModel;