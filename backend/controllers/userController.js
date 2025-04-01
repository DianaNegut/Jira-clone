import userModel from "../models/userModel.js";
import teamModel from "../models/teamModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import validator from "validator";
import multer from 'multer';
import path from 'path';

// Define the storage configuration first
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

// Now create the upload object using the storage configuration
const upload = multer({ storage: storage });

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials!" });
        }
        const token = createToken(user._id);
        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const assignTeamToUser = async (req, res) => {
    try {
        const { userId, teamId } = req.body;

        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(teamId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID or team ID format"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const team = await teamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        if (user.teams.includes(teamId)) {
            return res.status(400).json({
                success: false,
                message: "Team is already assigned to this user"
            });
        }

        // Add the user to the list of their teams
        user.teams.push(teamId);
        await user.save();

        // Add the user to the team if not already added
        if (!team.members.includes(userId)) {
            team.members.push(userId);
            await team.save();
        }

        // Return updated team data
        const updatedTeam = await teamModel.findById(teamId)
            .populate("leader", "name email")
            .populate("members", "name email")
            .populate("tasks", "title status");

        res.status(200).json({
            success: true,
            message: "User successfully assigned to team",
            team: updatedTeam
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error assigning team to user",
            error: error.message
        });
    }
};

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// register user
const registerUser = async (req, res) => {
    const { name, password, email, phone, companyName } = req.body;
    try {
        const exist1 = await userModel.findOne({ email });
        const exist2 = await userModel.findOne({ phone });
        if (exist1 && exist2) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email!" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Create account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            companyName: companyName
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).populate('teams');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                teams: user.teams.map(team => ({
                    _id: team._id,
                    name: team.name
                }))
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

const setProfilePicture = async (req, res) => {
    try {
        const userId = req.params.userId; // Extract userId from URL

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Relative path of the uploaded file
        const profilePicturePath = req.file.path.replace(/\\/g, '/'); // Normalize path

        // Find and update the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Set and save the new profile picture
        user.profilePicture = profilePicturePath;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture set successfully",
            profilePicture: profilePicturePath
        });

    } catch (error) {
        console.error("Error setting profile picture:", error);
        res.status(500).json({
            success: false,
            message: "Error setting profile picture",
            error: error.message
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const { userId } = req.params; // Presupunem că ID-ul utilizatorului este trimis ca parametru în URL

        // Validează ID-ul
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Caută utilizatorul în baza de date și populează câmpurile teams
        const user = await userModel.findById(userId).populate('teams');

        // Verifică dacă utilizatorul există
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Returnează informațiile utilizatorului
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyName: user.companyName,
                profilePicture: user.profilePicture,
                teams: user.teams.map(team => ({
                    _id: team._id,
                    name: team.name
                }))
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

export { loginUser, registerUser, assignTeamToUser, getCurrentUser, setProfilePicture, getUserById };