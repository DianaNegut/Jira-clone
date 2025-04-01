import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    profilePicture: {
        type: String, 
        required: false, 
        default: null
    },
    phone: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        required: true
    },
    companyName: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Tasks"
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team"
    }]
}, { 
    timestamps: true,
    minimize: false 
});


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;