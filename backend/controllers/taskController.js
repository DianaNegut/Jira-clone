import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import commentModel from '../models/commentModel.js';
import activitateModel from '../models/activitateModel.js';
import teamModel from "../models/teamModel.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

export const addCommentToTask = async (req, res) => {
    try {
        const { text } = req.body;
        const { taskId } = req.params;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: "Textul comentariului este necesar" });
        }


        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }


        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });
        }


        const newComment = new commentModel({
            text,
            user: userId,
            task: taskId,
        });


        await newComment.save();


        const activitateMessage = `Comentariul a fost adăugat de ${user.name}`;
        const newActivitate = new activitateModel({
            mesaj: activitateMessage,
            task: taskId,
            user: userId,
        });


        await newActivitate.save();


        res.status(201).json({
            message: "Comentariul a fost adăugat cu succes și activitatea a fost creată",
            comment: newComment,
            activitate: newActivitate,
        });
    } catch (error) {
        console.error("Eroare la adăugarea comentariului:", error);
        res.status(500).json({ error: "Eroare la adăugarea comentariului" });
    }
};


export const getCommentsForTask = async (req, res) => {
    try {
        const { taskId } = req.params;


        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }


        const comments = await commentModel.find({ task: taskId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Eroare la obținerea comentariilor:", error);
        res.status(500).json({ error: "Eroare la obținerea comentariilor" });
    }
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
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


    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
        id: payload.id,

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


export const addTimeToTask = async (req, res) => {
    try {
        const { timeToAdd } = req.body;

        if (!timeToAdd || typeof timeToAdd !== 'number' || timeToAdd < 0) {
            return res.status(400).json({
                error: "Invalid time value",
                details: "Time must be a positive number in minutes"
            });
        }

        const task = await taskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit" });
        }


        task.time_logged = (task.time_logged || 0) + timeToAdd;
        await task.save();


        const user = await userModel.findById(task.user);
        if (!user) {
            return res.status(404).json({ error: "Utilizatorul asociat task-ului nu a fost găsit" });
        }


        const newActivitate = new activitateModel({
            mesaj: `${user.name} a logat timp la taskul ${task.title}`,
            task: task._id,
            user: task.user,
            createdAt: new Date()
        });


        await newActivitate.save();

        res.status(200).json({
            message: "Timpul a fost actualizat cu succes și activitatea a fost înregistrată",
            task,
            activitate: newActivitate
        });
    } catch (error) {
        res.status(500).json({
            error: "Eroare la adăugarea timpului sau la crearea activității",
            details: error.message
        });
    }
};

export const addTask = async (req, res) => {
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
                return res.status(400).json({ error: "Request body is missing or empty" });
            }

            const { title, description, status, team, user, time_logged } = req.body;

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

            if (time_logged && (typeof time_logged !== 'number' || time_logged < 0)) {
                return res.status(400).json({
                    error: "Invalid time_logged value",
                    details: "Time must be a positive number in minutes"
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

            let existingTeam = await teamModel.findById(teamId);
            if (!existingTeam) {
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

            const filePaths = req.files ? req.files.map(file => `/images/${file.filename}`) : [];


            const task = new taskModel({
                title,
                description,
                status: status || undefined,
                team: existingTeam._id,
                user: userId,
                files: filePaths,
                time_logged: time_logged || 0
            });
            await task.save();


            existingTeam.tasks.push(task._id);
            await existingTeam.save();


            existingTeam = await teamModel.findById(teamId).populate("tasks");

            res.status(201).json({
                message: "Taskul a fost creat cu succes și adăugat echipei",
                task,
                team: existingTeam
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
            .populate("team")
            .populate("status")
            ;

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

export const getTaskByTitle = async (req, res) => {
    try {
        const { title } = req.params;

        if (!title) {
            return res.status(400).json({ error: "Titlul este necesar pentru căutare." });
        }

        const task = await taskModel.findOne({ title: new RegExp(title, "i") }).populate("user").populate("team");

        if (!task) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit." });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Eroare la obținerea task-ului după titlu:", error);
        res.status(500).json({ error: "Eroare la obținerea task-ului." });
    }
};


export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, team: newTeamId, user: newUserId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID task invalid" });
        }

        if (!title || !description || !status || !newTeamId) {
            return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
        }

        const validStatuses = ["unassigned", "in progress", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Status invalid" });
        }

        
        const existingTask = await taskModel.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: "Task-ul nu a fost găsit." });
        }
        
        const oldUserId = existingTask.user ? existingTask.user.toString() : null;
        const oldTeamId = existingTask.team ? existingTask.team.toString() : null;

        
        const updatedTask = await taskModel.findByIdAndUpdate(
            id,
            { title, description, status, team: newTeamId, user: newUserId },
            { new: true, runValidators: true }
        ).populate('team user');

  
        if (newUserId !== oldUserId) {
        
            if (oldUserId && mongoose.Types.ObjectId.isValid(oldUserId)) {
                await userModel.findByIdAndUpdate(
                    oldUserId,
                    { $pull: { tasks: id } }
                );
            }

        
            if (newUserId && mongoose.Types.ObjectId.isValid(newUserId)) {
                await userModel.findByIdAndUpdate(
                    newUserId,
                    { $addToSet: { tasks: id } } 
                );
            }
        }


        if (newTeamId !== oldTeamId) {
      
            if (oldTeamId && mongoose.Types.ObjectId.isValid(oldTeamId)) {
                await teamModel.findByIdAndUpdate(
                    oldTeamId,
                    { $pull: { tasks: id } }
                );
            }

        
            if (newTeamId && mongoose.Types.ObjectId.isValid(newTeamId)) {
                await teamModel.findByIdAndUpdate(
                    newTeamId,
                    { $addToSet: { tasks: id } }
                );
            }
        }

   
        const userId = req.userId;
        const userDoc = await userModel.findById(userId);
        const mesaj = `${userDoc.name} a modificat taskul: ${updatedTask.title}`;

        await activitateModel.create({
            mesaj,
            task: updatedTask._id,
            user: userId,
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Eroare actualizare task:", error);
        res.status(500).json({
            error: "Eroare la actualizarea task-ului.",
            details: error.message
        });
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



export const getTeamTasksNew = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { status, userId } = req.query;

        
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({
                error: "ID echipă invalid",
                details: { teamId }
            });
        }

        const teamExists = await teamModel.exists({ _id: teamId });
        if (!teamExists) {
            return res.status(404).json({
                error: "Echipă negăsită",
                details: { teamId }
            });
        }

        const query = { team: teamId };

       
        if (status) {
            if (!["unassigned", "in progress", "completed"].includes(status)) {
                return res.status(400).json({
                    error: "Status invalid",
                    details: { validStatuses: ["unassigned", "in progress", "completed"] }
                });
            }
            query.status = status;
        }

       
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    error: "ID utilizator invalid",
                    details: { userId }
                });
            }
            query.user = userId;
        }

    
        const tasks = await taskModel.find(query)
            .populate({
                path: 'user',
                select: 'name email profilePicture'
            })
            .populate({
                path: 'team',
                select: 'name'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        console.error("Eroare la obținerea task-urilor echipei:", error);
        res.status(500).json({
            error: "Eroare la obținerea task-urilor echipei",
            details: error.message
        });
    }
};


export const getTeamTasksByName = async (req, res) => {
    try {
        const { teamName } = req.params;
        const { status, userId } = req.query;

    
        const team = await teamModel.findOne({ name: teamName });
        if (!team) {
            return res.status(404).json({
                error: "Echipă negăsită",
                details: { teamName }
            });
        }

  
        const query = { team: team._id };

    
        if (status) {
            if (!["unassigned", "in progress", "completed"].includes(status)) {
                return res.status(400).json({
                    error: "Status invalid",
                    details: { validStatuses: ["unassigned", "in progress", "completed"] }
                });
            }
            query.status = status;
        }

   
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    error: "ID utilizator invalid",
                    details: { userId }
                });
            }
            query.user = userId;
        }

 
        const tasks = await taskModel.find(query)
            .populate({
                path: 'user',
                select: 'name email profilePicture'
            })
            .populate({
                path: 'team',
                select: 'name'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        console.error("Eroare la obținerea task-urilor echipei:", error);
        res.status(500).json({
            error: "Eroare la obținerea task-urilor echipei",
            details: error.message
        });
    }
};


export const getTasksByCompanyName = async (req, res) => {
    const { companyName } = req.params;
  
    try {
  
      const teams = await teamModel.find({ companyName });
  
      if (!teams || teams.length === 0) {
        return res.status(404).json({ message: "No teams found for this company." });
      }
  
      
      const teamIds = teams.map(team => team._id);
  
      const tasks = await taskModel.find({ team: { $in: teamIds } })
        .populate("team", "name")
        .populate("user", "name email");
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };




export const getTaskCountByCompanyName = async (req, res) => {
    try {
      const { companyName } = req.params;
      
      if (!companyName) {
        return res.status(400).json({ 
          success: false,
          message: 'Company name is required'
        });
      }
  
      const teams = await teamModel.find({ companyName });
      const teamIds = teams.map(team => team._id);
      
      const taskCount = await taskModel.countDocuments({ team: { $in: teamIds } });
      
      res.json({ 
        success: true,
        count: taskCount
      });
    } catch (error) {
      console.error('Error getting task count:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error retrieving task count'
      });
    }
  };