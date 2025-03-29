import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";

export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const existingTeam = await teamModel.findOne({ name });
        if (existingTeam) return res.status(400).json({ message: "Team already exists" });
        const newTeam = new teamModel({ name });
        await newTeam.save();
        res.status(201).json({ message: "Echipa a fost creată cu succes", team: newTeam });
    } catch(error) {
        res.status(500).json({ message: "Eroare la adaugarea echipei" });
    }
}

export const getAllTeams = async (req, res) => {
  try {
      console.log("Attempting to fetch teams...");
      
      const teams = await teamModel.find()
          .populate({
              path: "leader", 
              select: "name email"
          })
          .populate({
              path: "members", 
              select: "name email"
          });
      
      // Only try to populate tasks if they exist
      if (mongoose.modelNames().includes('Task')) {
          await Promise.all(teams.map(async (team) => {
              if (team.tasks && team.tasks.length > 0) {
                  await team.populate({
                      path: "tasks", 
                      select: "title status"
                  });
              }
          }));
      }
      
      res.status(200).json({ 
          message: "Teams retrieved successfully", 
          teams: teams,
          count: teams.length
      });
  } catch(error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ 
          message: "Eroare la preluarea echipelor", 
          errorDetails: error.message 
      });
  }
}

export const updateTeam = async (req, res) => { 
    try {
        const { name } = req.body;
        const team = await teamModel.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Echipa nu a fost gasita" });
        if (name && name != team.name) {
            const existingTeam = await teamModel.findOne({ name });
            if (existingTeam) return res.status(400).json({ message: "Echipa exista deja" });
        }
        const updatedTeam = await teamModel.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.status(200).json({ message: "Echipa a fost actualizata cu succes", team: updatedTeam });
    } catch(error) {
        res.status(500).json({ message: "Eroare la actualizarea echipei" });
    }
}

export const deleteTeam = async (req, res) => {
    try {
        const team = await teamModel.findById(req.params.id);
        if (!team) {
          return res.status(404).json({ message: "Echipa nu a fost găsită" });
        }
    
        await taskModel.deleteMany({ team: team._id });
    
        await userModel.updateMany(
          { tasks: { $in: team.tasks } },
          { $pull: { tasks: { $in: team.tasks } } }
        );
    
        await teamModel.findByIdAndDelete(req.params.id);
    
        res.status(200).json({ message: "Echipa și task-urile asociate au fost șterse cu succes" });
      } catch (error) {
        res.status(500).json({ message: "Eroare la ștergerea echipei", error: error.message });
      }
}

export const addMemberToTeam = async (req, res) => {
    try {
      const team = await teamModel.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Echipa nu a fost găsită" });
      }
  
      const user = await userModel.findById(req.params.memberId);
      if (!user) {
        return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
      }
  
      // Verificăm dacă utilizatorul este deja membru
      if (team.members.includes(user._id)) {
        return res.status(400).json({ message: "Utilizatorul este deja membru al echipei" });
      }
  
      // Adăugăm utilizatorul în lista de membri
      team.members.push(user._id);
      await team.save();
  
      const updatedTeam = await teamModel.findById(req.params.id)
        .populate("leader", "name email")
        .populate("members", "name email")
        .populate("tasks", "title status");
  
      res.status(200).json({ message: "Membru adăugat cu succes", team: updatedTeam });
    } catch (error) {
      res.status(500).json({ message: "Eroare la adăugarea membrului", error: error.message });
    }
  };

export const removeMemberFromTeam = async (req, res) => {
    try {
      const team = await teamModel.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Echipa nu a fost găsită" });
      }
  
      const user = await userModel.findById(req.params.memberId);
      if (!user) {
        return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
      }
  
      // Verificăm dacă utilizatorul este membru
      if (!team.members.includes(user._id)) {
        return res.status(400).json({ message: "Utilizatorul nu este membru al echipei" });
      }
  
      // Eliminăm utilizatorul din lista de membri
      team.members = team.members.filter((member) => member.toString() !== user._id.toString());
  
      // Dacă utilizatorul era lider, eliminăm liderul
      if (team.leader && team.leader.toString() === user._id.toString()) {
        team.leader = null;
      }
  
      await team.save();
  
      const updatedTeam = await teamModel.findById(req.params.id)
        .populate("leader", "name email")
        .populate("members", "name email")
        .populate("tasks", "title status");
  
      res.status(200).json({ message: "Membru eliminat cu succes", team: updatedTeam });
    } catch (error) {
      res.status(500).json({ message: "Eroare la eliminarea membrului", error: error.message });
    }
  };