import activitateModel from "../models/activitateModel.js";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";


const createActivitate = async (req, res) => {
  try {
    const { mesaj, taskId, userId } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID or user ID format",
      });
    }

    
    const task = await taskModel.findById(taskId);
    const user = await userModel.findById(userId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    const newActivitate = await activitateModel.create({
      mesaj,
      task: taskId,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Activitate creată cu succes",
      activitate: newActivitate,
    });

  } catch (error) {
    console.error("Eroare la crearea activității:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la crearea activității",
      error: error.message,
    });
  }
};


const getAllActivitati = async (req, res) => {
  try {
    const { companyName } = req.query;

    const filter = {};

    if (companyName) {
      // Obține activitățile doar pentru utilizatorii din compania respectivă
      const activitati = await activitateModel
        .find()
        .populate({
          path: "user",
          match: { companyName }, // filtrăm aici după companie
          select: "name email profilePicture companyName"
        })
        .populate("task", "title status")
        .sort({ createdAt: -1 });

      // eliminăm activitățile unde userul nu a fost returnat (nu e din compania dorită)
      const filtered = activitati.filter((a) => a.user !== null);

      return res.status(200).json(filtered);
    }

    // Dacă nu avem companie specificată, returnăm toate activitățile
    const allActivitati = await activitateModel
      .find()
      .populate("user", "name email profilePicture companyName")
      .populate("task", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json(allActivitati);
  } catch (error) {
    console.error("Eroare la obținerea activităților:", error);
    res.status(500).json({ error: error.message });
  }
};


const getActivitateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activitate ID format",
      });
    }

    const activitate = await activitateModel
      .findById(id)
      .populate("user", "name email")
      .populate("task", "title status");

    if (!activitate) {
      return res.status(404).json({
        success: false,
        message: "Activitate nu a fost găsită",
      });
    }

    res.status(200).json({
      success: true,
      activitate,
    });

  } catch (error) {
    console.error("Eroare la obținerea activității:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la obținerea activității",
      error: error.message,
    });
  }
};


const updateActivitate = async (req, res) => {
  try {
    const { id } = req.params;
    const { mesaj, taskId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activitate ID format",
      });
    }

    
    if (taskId && !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const activitate = await activitateModel.findById(id);

    if (!activitate) {
      return res.status(404).json({
        success: false,
        message: "Activitate nu a fost găsită",
      });
    }

    
    if (mesaj) activitate.mesaj = mesaj;
    if (taskId) activitate.task = taskId;
    if (userId) activitate.user = userId;

    await activitate.save();

    res.status(200).json({
      success: true,
      message: "Activitate actualizată cu succes",
      activitate,
    });

  } catch (error) {
    console.error("Eroare la actualizarea activității:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la actualizarea activității",
      error: error.message,
    });
  }
};


const deleteActivitate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activitate ID format",
      });
    }

    const activitate = await activitateModel.findByIdAndDelete(id);

    if (!activitate) {
      return res.status(404).json({
        success: false,
        message: "Activitate nu a fost găsită",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activitate ștearsă cu succes",
    });

  } catch (error) {
    console.error("Eroare la ștergerea activității:", error);
    res.status(500).json({
      success: false,
      message: "Eroare la ștergerea activității",
      error: error.message,
    });
  }
};

export {
  createActivitate,
  getAllActivitati,
  getActivitateById,
  updateActivitate,
  deleteActivitate,
};