import userModel from "../models/userModel.js";
import teamModel from "../models/teamModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import validator from "validator";
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'preturi.alerta@gmail.com', // Adresa ta de email
        pass: 'twcj qmgg ourc ncdh' // Parola ta de email (pentru aplicatii mai sigure, folosește un App Password dacă ai 2FA activat)
    }
});
const generateTempPassword = () => {
    return crypto.randomBytes(8).toString('hex'); // Generază un token unic de 16 caractere
};


const registerUserWithTempPassword = async (req, res) => {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
    const { name, email, role, phone, companyName } = req.body;
    let token;

    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists" });
        }

       
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email!" });
        }

        const tempPassword = generateTempPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone || '',
            password: hashedPassword,
            companyName: companyName || '',
            role: role || 'developer',
        });

        const user = await newUser.save();
        token = createToken(user._id);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Parola temporară pentru contul tău',
            text: `Bine ai venit, ${name}!\n\nParola ta temporară este: ${tempPassword}\nTe rugăm să o schimbi după prima autentificare.\n\nLink login: http://localhost:4000/login`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Bine ai venit, ${name}!</h2>
                    <p>Contul tău a fost creat cu succes.</p>
                    <p><strong>Parola ta temporară este:</strong> ${tempPassword}</p>
                    <p>Te rugăm să o schimbi după prima autentificare.</p>
                    <p><a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Autentificare</a></p>
                    <p>Sau accesează acest link: <a href="http://localhost:4000/login">http://localhost:4000/login</a></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Utilizatorul a fost creat cu succes! Parola temporară a fost trimisă pe email.', token });
    } catch (error) {
        console.error("Error in registerUserWithTempPassword:", error);
        res.json({
            success: false,
            message: 'An error occurred while creating the user or sending the email.',
            error: error.message,
            token: token || null // Fallback to null if token is not set
        });
    }
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

const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;


        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Șterge utilizatorul
        await userModel.findByIdAndDelete(user._id);

        // Elimină utilizatorul din echipe
        await teamModel.updateMany(
            { members: user._id },
            { $pull: { members: user._id } }
        );

        // Elimină utilizatorul din task-uri (setează statusul la "unassigned")
        await taskModel.updateMany(
            { user: user._id },
            { $unset: { user: 1 }, $set: { status: "unassigned" } }
        );

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
    }
};


const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        // 1. Validate Input
        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (newPassword.length < 8) { // Example: Minimum password length
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
        }

        // 2. Find User
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 3. Verify Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }

        // 4. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 5. Update Password
        user.password = hashedPassword;
        await user.save();

        // 6. Respond
        res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ success: false, message: "Error changing password", error: error.message });
    }
};



export { loginUser, registerUser, assignTeamToUser, getCurrentUser, setProfilePicture, getUserById, deleteUser, registerUserWithTempPassword , changePassword };