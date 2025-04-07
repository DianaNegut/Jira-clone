import teamModel from "../models/teamModel.js";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Crearea unei echipe
export const createTeam = async (req, res) => {
  try {
    const { name, companyName } = req.body; // Preia și companyName din body

    if (!name) {
      return res.status(400).json({ message: "Numele echipei este obligatoriu" });
    }

    const existingTeam = await teamModel.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: "Echipa există deja" });
    }

    const newTeam = new teamModel({ 
      name,
      companyName, // Adăugăm companyName ca String
    });
    await newTeam.save();

    res.status(201).json({
      message: "Echipa a fost creată cu succes",
      team: newTeam,
    });
  } catch (error) {
    console.error("Eroare la adăugarea echipei:", error);
    res.status(500).json({ message: "Eroare la adăugarea echipei", error: error.message });
  }
};

// Obținerea tuturor echipelor
export const getAllTeams = async (req, res) => {
  try {
    const { companyName } = req.query;

    let teams;

    if (companyName) {
      teams = await teamModel.find({ companyName })
        .populate({
          path: "leader", 
          select: "name email"
        })
        .populate({
          path: "members", 
          select: "name email"
        });
      
      if (mongoose.modelNames().includes('Tasks')) {
        await Promise.all(teams.map(async (team) => {
          if (team.tasks && team.tasks.length > 0) {
            await team.populate({
              path: "tasks", 
              select: "title status"
            });
          }
        }));
      }
    } else {
      teams = await teamModel.find()
        .populate({
          path: "leader", 
          select: "name email"
        })
        .populate({
          path: "members", 
          select: "name email"
        });

      if (mongoose.modelNames().includes('Tasks')) {
        await Promise.all(teams.map(async (team) => {
          if (team.tasks && team.tasks.length > 0) {
            await team.populate({
              path: "tasks", 
              select: "title status"
            });
          }
        }));
      }
    }

    res.status(200).json({ 
      message: "Teams retrieved successfully", 
      teams: teams,
      count: teams.length
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ 
      message: "Eroare la preluarea echipelor", 
      errorDetails: error.message 
    });
  }
};

// Obținerea taskurilor echipei
export const getTeamTasks = async (req, res) => {
  try {
    const teamId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "ID-ul echipei este invalid" });
    }

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

// Obținerea echipelor după ID-ul utilizatorului
export const getTeamsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

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

// Obținerea membrilor echipei
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

// Ștergerea echipei
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
};

// Adăugarea unui membru la echipă
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

    if (team.members.includes(user._id)) {
      return res.status(400).json({ message: "Utilizatorul este deja membru al echipei" });
    }

    team.members.push(user._id);
    await team.save();

    if (!user.teams.includes(team._id)) {
      user.teams.push(team._id);
      await user.save();
    }

    const updatedTeam = await teamModel.findById(req.params.id)
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("tasks", "title status");

    const updatedUser = await userModel.findById(req.params.memberId)
      .populate("teams", "name");

    res.status(200).json({
      message: "Membru adăugat cu succes",
      team: updatedTeam,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare la adăugarea membrului", error: error.message });
  }
};

// Eliminarea unui membru din echipă
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

    if (!team.members.includes(user._id)) {
      return res.status(400).json({ message: "Utilizatorul nu este membru al echipei" });
    }

    team.members = team.members.filter((member) => member.toString() !== user._id.toString());

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

// Preluarea taskurilor neasignate
export const getUnassignedTeamTasks = async (req, res) => {
  try {
    const teamId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "ID-ul echipei este invalid" });
    }

    const team = await teamModel.findById(teamId)
      .populate({
        path: 'tasks',
        match: { status: "unassigned", user: null }, 
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

    const unassignedTasks = team.tasks.filter(task => task && task.status === "unassigned" && !task.user);

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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: "preturi.alerta@gmail.com",
      pass: "twcj qmgg ourc ncdh",
  },
});

export const assignTaskToUser = async (req, res) => {
  const { taskId, userId } = req.params;

  try {
    console.log(`Attempting to assign task ${taskId} to user ${userId}`);
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid task or user ID format" });
    }

    const task = await taskModel.findById(taskId);
    console.log("Task found:", task ? "Yes" : "No");
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await userModel.findById(userId);
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if task belongs to a team
    if (!task.team) {
      console.log("Task has no team associated");
      return res.status(400).json({ message: "Task has no team associated" });
    }
    
    // Check if user is a member of the team
    const team = await teamModel.findById(task.team);
    if (!team) {
      console.log("Team not found");
      return res.status(404).json({ message: "Team not found" });
    }
    
    const isUserTeamMember = team.members.some(member => member.toString() === userId);
    if (!isUserTeamMember) {
      console.log("User is not a member of the task's team");
      return res.status(403).json({ message: "User is not a member of the task's team" });
    }

    // Assign user to task
    task.user = userId;
    task.status = "in progress";
    console.log("Saving task with new user assignment");
    
    await task.save();
    console.log("Task saved successfully");

    const mailOptions = {
      from: "preturi.alerta@gmail.com",
      to: user.email,
      subject: "Nou task",
      text: `Ai un nou task asignat: ${taskId}`,
      html: `
        <h1>Ai un nou task asignat</h1>
        <p>Task ID: ${taskId}</p>
        <p>Detalii task: ${task.title || 'No title'} - ${task.description || 'No description'}</p>
        <p>Te rugăm să verifici aplicația pentru mai multe detalii.</p>
        <p>Mulțumim!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Also update the user's tasks array if needed
    if (!user.tasks.includes(task._id)) {
      user.tasks.push(task._id);
      await user.save();
      console.log("User's tasks array updated");
    }

    res.status(200).json({
      message: "Task assigned successfully",
      task: task,
    });
  } catch (error) {
    console.error("Error in assignTaskToUser:", error);
    res.status(500).json({
      message: "Error assigning task",
      error: error.message,
    });
  }
};

// In controllers/teamController.js
export const updateTeam = async (req, res) => {
  const teamId = req.params.id;
  const { name, companyName } = req.body;

  try {
      const team = await teamModel.findById(teamId);
      if (!team) {
          return res.status(404).json({ message: "Echipa nu a fost găsită" });
      }
      if (name) team.name = name;
      if (companyName) team.companyName = companyName;

      await team.save();

      res.status(200).json({
          message: "Echipa a fost actualizată cu succes",
          team,
      });
  } catch (error) {
      console.error("Eroare la actualizarea echipei:", error);
      res.status(500).json({ message: "Eroare la actualizarea echipei", error: error.message });
  }
};
