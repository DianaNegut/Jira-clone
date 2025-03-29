import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import teamModel from "../models/teamModel.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage }).array("images"); 

export const uploadTaskFiles = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Eroare la încărcarea fișierelor" });
        }
  
        const task = await taskModel.findById(req.params.id);
        if (!task) {
          return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }
  
        // Adăugăm noile fișiere la array-ul existent
        const newFiles = req.files.map(file => `/images/${file.filename}`);
        task.files = [...task.files, ...newFiles];
        
        await task.save();
        res.status(200).json(task);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Decodează token-ul (fără verificare)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
        id: payload.id,
        // alte câmpuri pe care le-ai inclus în token
    };
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.userId = decoded.id; 
        next();
    });
};


export const addTask = async (req, res) => {
    // Use multer middleware to process file uploads
    upload(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ 
                error: "Eroare la încărcarea fișierelor", 
                details: err.message 
            });
        }

        try {
            console.log("Request headers:", req.headers);
            console.log("Raw request body:", req.body);
            console.log("Uploaded files:", req.files);

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ 
                    error: "Request body is missing or empty" 
                });
            }

            const { title, description, status, team, user } = req.body;
            console.log("Destructured values:", { title, description, status, team, user });

            if (!title || !description || !team) {
                return res.status(400).json({ 
                    error: "Missing required fields",
                    details: { title: !!title, description: !!description, team: !!team }
                });
            }

            const validStatuses = ["unassigned", "in progress", "completed"];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({ 
                    error: "Invalid status value",
                    details: { provided: status, allowed: validStatuses }
                });
            }

            let teamId;
            try {
                if (typeof team !== "string" || !mongoose.isValidObjectId(team)) {
                    throw new Error("Invalid team ID format");
                }
                teamId = new mongoose.Types.ObjectId(team.trim());
            } catch (err) {
                return res.status(400).json({ 
                    error: "Invalid team ID",
                    details: { team, message: err.message }
                });
            }
            console.log("Team ID after casting:", teamId);

            const existingTeam = await teamModel.findById(teamId);
            console.log("Echipă găsită:", existingTeam);
            if (!existingTeam) {
                const allTeams = await teamModel.find({});
                console.log("Toate echipele:", allTeams);
                return res.status(400).json({ 
                    error: "Echipa selectată nu există",
                    details: { teamId: teamId.toString() }
                });
            }

            let userId = null;
            if (user) {
                try {
                    if (typeof user !== "string" || !mongoose.isValidObjectId(user)) {
                        throw new Error("Invalid user ID format");
                    }
                    userId = new mongoose.Types.ObjectId(user.trim());
                } catch (err) {
                    return res.status(400).json({ 
                        error: "Invalid user ID",
                        details: { user, message: err.message }
                    });
                }
            }
            console.log("User ID after casting (if provided):", userId);

            // Handle uploaded files (optional)
            const filePaths = req.files ? req.files.map(file => `/images/${file.filename}`) : [];

            // Create and save the task
            const task = new taskModel({ 
                title, 
                description, 
                status: status || undefined, // Let Mongoose apply default if undefined
                team: existingTeam._id,
                user: userId, // Will be null if not provided
                files: filePaths // Store file paths (empty array if no files)
            });
            await task.save();

            // Send a single response
            res.status(201).json({ 
                message: "Taskul a fost creat cu succes", 
                task 
            });
        } catch (error) {
            console.error("Eroare detaliată:", error);
            res.status(500).json({ 
                error: "Eroare la adăugarea task-ului",
                details: error.message
            });
        }
    });
};


export const getTasksByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
       
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ 
                error: "ID utilizator invalid",
                details: { userId }
            });
        }

        
        const tasks = await taskModel.find({ user: userId })
            .populate("user")
            .populate("team");

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Eroare la obținerea task-urilor utilizatorului:", error);
        res.status(500).json({ 
            error: "Eroare la obținerea task-urilor utilizatorului",
            details: error.message
        });
    }
};






export const getTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find().populate("user").populate("team");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Eroare la obținerea task-urilor." });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id).populate("user").populate("team");
        if (!task) return res.status(404).json({ error: "Task-ul nu a fost găsit." });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: "Eroare la obținerea task-ului." });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ error: "Task-ul nu a fost găsit." });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Eroare la actualizarea task-ului." });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task-ul nu a fost găsit." });

        
        if (task.user) {
            await userModel.findByIdAndUpdate(task.user, { $pull: { tasks: task._id } });
        }

        res.status(200).json({ message: "Task-ul a fost șters." });
    } catch (error) {
        res.status(500).json({ error: "Eroare la ștergerea task-ului." });
    }
};
