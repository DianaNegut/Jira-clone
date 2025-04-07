import userModel from "../models/userModel.js";
import teamModel from "../models/teamModel.js";
import companyModel from "../models/companyModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";

async function getCompanyNameByUserId(userId) {
    try {
        // Verifică dacă userId este un șir valid de 24 de caractere hexazecimale
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("ID-ul utilizatorului nu este valid");
        }

        const user = await userModel.findById(userId).populate("teams");

        if (!user) {
            throw new Error("Utilizatorul nu a fost găsit");
        }

        // Log pentru a verifica dacă user.teams este populat corect
        console.log("User teams:", user.teams);

        if (!user.teams || user.teams.length === 0) {
            return null;
        }

        const team = user.teams[0];

        // Log pentru a verifica ID-ul echipei
        console.log("Team ID:", team._id);

        const company = await companyModel.findOne({ teams: team._id });

        if (!company) {
            console.log("Nu s-a găsit compania pentru echipa cu ID-ul:", team._id);
            return null;
        }

        return company.name;
    } catch (error) {
        console.error("Eroare la obținerea numelui companiei:", error.message);
        throw error;
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

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

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID or team ID format",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const team = await teamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        if (user.teams.includes(teamId)) {
            return res.status(400).json({
                success: false,
                message: "Team is already assigned to this user",
            });
        }

        user.teams.push(teamId);
        await user.save();

        if (!team.members.includes(userId)) {
            team.members.push(userId);
            await team.save();
        }

        const updatedTeam = await teamModel
            .findById(teamId)
            .populate("leader", "name email")
            .populate("members", "name email")
            .populate("tasks", "title status");

        res.status(200).json({
            success: true,
            message: "User successfully assigned to team",
            team: updatedTeam,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error assigning team to user",
            error: error.message,
        });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "preturi.alerta@gmail.com",
        pass: "twcj qmgg ourc ncdh",
    },
});
const generateTempPassword = () => {
    return crypto.randomBytes(8).toString("hex");
};

const registerUserWithTempPassword = async (req, res) => {
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
            phone: phone || "",
            password: hashedPassword,
            companyName: companyName || "",
            role: role || "developer",
        });

        const user = await newUser.save();
        token = createToken(user._id);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Parola temporară pentru contul tău",
            text: `Bine ai venit, ${name}!\n\nParola ta temporară este: ${tempPassword}\nTe rugăm să o schimbi după prima autentificare.\n\nLink login: http://localhost:4000/login`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Bine ai venit, ${name}!</h2>
                    <p>Contul tău a fost creat cu succes.</p>
                    <p><strong>Parola ta temporară este:</strong> ${tempPassword}</p>
                    <p>Te rugăm să o schimbi după prima autentificare.</p>
                    <p><a href="http://localhost:4000/login" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Autentificare</a></p>
                    <p>Sau accesează acest link: <a href="http://localhost:4000/login">http://localhost:4000/login</a></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Utilizatorul a fost creat cu succes! Parola temporară a fost trimisă pe email.",
            token,
        });
    } catch (error) {
        console.error("Error in registerUserWithTempPassword:", error);
        res.json({
            success: false,
            message: "An error occurred while creating the user or sending the email.",
            error: error.message,
            token: token || null,
        });
    }
};

const registerUser = async (req, res) => {
    const { name, password, email, phone, companyName } = req.body;
    try {
        const exist1 = await userModel.findOne({ email });
        const exist2 = await userModel.findOne({ phone });
        if (exist1 && exist2) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email!" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            companyName: null,
            role: "Angajat",
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (!["Angajat", "Administrator", "Available"].includes(newRole)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user role",
            error: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).populate("teams");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture, companyName: user.companyName,
                teams: user.teams.map((team) => ({
                    _id: team._id,
                    name: team.name,
                })),
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

const setProfilePicture = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const profilePicturePath = req.file.path.replace(/\\/g, "/");

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.profilePicture = profilePicturePath;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture set successfully",
            profilePicture: profilePicturePath,
        });
    } catch (error) {
        console.error("Error setting profile picture:", error);
        res.status(500).json({
            success: false,
            message: "Error setting profile picture",
            error: error.message,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await userModel.findById(userId).populate("teams");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyName: user.companyName,
                profilePicture: user.profilePicture,
                teams: user.teams.map((team) => ({
                    _id: team._id,
                    name: team.name,
                })),
            },
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

        await userModel.findByIdAndDelete(user._id);

        await teamModel.updateMany(
            { members: user._id },
            { $pull: { members: user._id } }
        );

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
        console.log("Received change password request with:", { userId, oldPassword, newPassword });

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        console.log("Validating userId:", userId, "Is valid ObjectId?", mongoose.Types.ObjectId.isValid(userId));

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ success: false, message: "Invalid user ID" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ success: false, message: "Error changing password", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password").populate("teams", "name");
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

const getCompanyName = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Received userId:", userId); // Pentru depanare

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID-ul utilizatorului nu este valid" });
        }

        const companyName = await getCompanyNameByUserId(userId);

        if (!companyName) {
            return res.status(404).json({ success: false, message: "Nu s-a găsit nicio companie asociată utilizatorului" });
        }

        return res.status(200).json({ success: true, companyName });
    } catch (error) {
        console.error("Eroare în controller:", error.message);
        return res.status(500).json({ success: false, message: "Eroare la obținerea numelui companiei", error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.params.email });
      if (!user) {
        return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Eroare la căutarea utilizatorului", error: error.message });
    }
  };

  const setCompanyName = async (req, res) => {
    try {
        const { userId, newCompanyName } = req.body;

        // Validare userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "ID-ul utilizatorului nu este valid" });
        }

        // Verificare dacă noul nume al companiei este furnizat
        if (!newCompanyName || typeof newCompanyName !== 'string' || newCompanyName.trim() === '') {
            return res.status(400).json({ success: false, message: "Numele companiei este obligatoriu și trebuie să fie un șir valid" });
        }

        // Căutare utilizator
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizatorul nu a fost găsit" });
        }

        // Actualizare nume companie
        user.companyName = newCompanyName.trim();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Numele companiei a fost actualizat cu succes",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Eroare la setarea numelui companiei:", error.message);
        res.status(500).json({
            success: false,
            message: "Eroare la setarea numelui companiei",
            error: error.message,
        });
    }
};

export {
    loginUser,
    registerUser,
    getCompanyNameByUserId,
    assignTeamToUser,
    getCurrentUser,
    updateUserRole,
    setProfilePicture,
    getUserById,
    deleteUser,
    registerUserWithTempPassword,
    changePassword,
    getAllUsers,setCompanyName,
    getCompanyName
};