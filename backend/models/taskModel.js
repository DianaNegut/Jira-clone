import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        default: "unassigned", 
        enum: ["unassigned", "in progress", "completed"] 
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    files: [{ 
        type: String, 
        required: false 
    }],
    time_logged: { 
        type: Number, 
        default: 0, 
        required: false 
    }
});

const taskModel = mongoose.models.Tasks || mongoose.model("Tasks", taskSchema);
export default taskModel;