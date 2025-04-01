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

export const getTeamsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

    // Find teams where the user is a member
    const teams = await teamModel.find({ 
      members: userId 
    })
    .populate("leader", "name email")
    .populate("members", "name email")
    .populate("tasks", "title status");

    if (!teams || teams.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No teams found for this user",
        teams: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Teams retrieved successfully",
      teams: teams,
      count: teams.length
    });
  } catch (error) {
    console.error("Error fetching user's teams:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving user's teams", 
      error: error.message 
    });
  }
};


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

export const getTeamMembers = async (req, res) => {
  try {
      const team = await teamModel.findById(req.params.id).populate("members", "name email");

      if (!team) {
          return res.status(404).json({ message: "Echipa nu a fost găsită" });
      }

      res.status(200).json({
          message: "Membrii echipei au fost preluați cu succes",
          members: team.members
      });
  } catch (error) {
      res.status(500).json({
          message: "Eroare la preluarea membrilor echipei",
          error: error.message
      });
  }
};



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



  export const getTeamTasks = async (req, res) => {
    try {
        const teamId = req.params.id;

        // Verificăm dacă ID-ul echipei este valid
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ message: "ID-ul echipei este invalid" });
        }

        // Găsim echipa și populăm taskurile cu informații relevante
        const team = await teamModel.findById(teamId)
            .populate({
                path: 'tasks',
                select: 'title description status user files time_logged',
                populate: [
                    {
                        path: 'user',
                        select: 'name email'
                    },
                    {
                        path: 'team',
                        select: 'name'
                    }
                ]
            });

        if (!team) {
            return res.status(404).json({ message: "Echipa nu a fost găsită" });
        }

        // Structurăm răspunsul
        const response = {
            team: {
                _id: team._id,
                name: team.name
            },
            tasks: team.tasks.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                time_logged: task.time_logged,
                assignedTo: task.user ? {
                    _id: task.user._id,
                    name: task.user.name,
                    email: task.user.email
                } : null,
                files: task.files || [],
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            }))
        };

        res.status(200).json({
            message: "Taskurile echipei au fost preluate cu succes",
            data: response
        });

    } catch (error) {
        console.error("Eroare la preluarea taskurilor echipei:", error);
        res.status(500).json({
            message: "Eroare la preluarea taskurilor echipei",
            error: error.message
        });
    }
};


export const getUnassignedTeamTasks = async (req, res) => {
  try {
      const teamId = req.params.id;

      // Verificăm dacă ID-ul echipei este valid
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
          return res.status(400).json({ message: "ID-ul echipei este invalid" });
      }

      // Găsim echipa și populăm taskurile
      const team = await teamModel.findById(teamId)
          .populate({
              path: 'tasks',
              match: { status: "unassigned", user: null }, // Filtrăm task-urile neasignate
              select: 'title description status files time_logged',
              populate: [
                  {
                      path: 'team',
                      select: 'name'
                  }
              ]
          });

      if (!team) {
          return res.status(404).json({ message: "Echipa nu a fost găsită" });
      }

      // Filtrăm task-urile pentru a ne asigura că sunt doar cele neasignate
      const unassignedTasks = team.tasks.filter(task => task && task.status === "unassigned" && !task.user);

      // Structurăm răspunsul
      const response = {
          team: {
              _id: team._id,
              name: team.name
          },
          unassignedTasks: unassignedTasks.map(task => ({
              _id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              time_logged: task.time_logged,
              files: task.files || [],
              createdAt: task.createdAt,
              updatedAt: task.updatedAt
          }))
      };

      res.status(200).json({
          message: "Taskurile neasignate ale echipei au fost preluate cu succes",
          data: response,
          count: unassignedTasks.length
      });

  } catch (error) {
      console.error("Eroare la preluarea taskurilor neasignate ale echipei:", error);
      res.status(500).json({
          message: "Eroare la preluarea taskurilor neasignate ale echipei",
          error: error.message
      });
  }
};


export const assignTaskToUser = async (req, res) => {
  console.log("Cerere primită pentru asignarea task-ului:", req.params);
  try {
      const taskId = req.params.taskId;
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "ID-ul task-ului sau al utilizatorului este invalid" });
      }

      const task = await taskModel.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: "Task-ul nu a fost găsit" });
      }

      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
      }

      task.user = userId;
      task.status = "in progress";

      await task.save();

      res.status(200).json({
          message: "Task-ul a fost asignat cu succes utilizatorului",
          task: {
              _id: task._id,
              title: task.title,
              description: task.description,
              status: task.status,
              assignedTo: {
                  _id: user._id,
                  name: user.name,
                  email: user.email
              },
              time_logged: task.time_logged,
              files: task.files
          }
      });

  } catch (error) {
      console.error("Eroare la asignarea task-ului:", error);
      res.status(500).json({
          message: "Eroare la asignarea task-ului utilizatorului",
          error: error.message
      });
  }
};