import activitateModel from "../models/activitateModel.js";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";

// Creață o nouă activitate
const createActivitate = async (req, res) => {
  try {
    const { mesaj, taskId, userId } = req.body;

    // Validează ID-urile
    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID or user ID format",
      });
    }

    // Verifică dacă task-ul și utilizatorul există
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

    // Creează noua activitate
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

// Obține toate activitățile
const getAllActivitati = async (req, res) => {
  try {
    const activitati = await activitateModel
      .find()
      .populate("user", "nume email") // Schimbat din "name" în "nume"
      .populate("task", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json(activitati); // Trimite direct array-ul, nu un obiect cu success
  } catch (error) {
    console.error("Eroare la obținerea activităților:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obține o activitate după ID
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

// Actualizează o activitate după ID
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

    // Validează noile ID-uri, dacă sunt furnizate
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

    // Actualizează câmpurile
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

// Șterge o activitate după ID
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