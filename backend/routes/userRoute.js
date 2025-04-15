import express from "express";
import multer from "multer";
import path from "path";
import {
    loginUser,
    registerUser,
    getCompanyNameByUserId,
    assignTeamToUser,getUserByEmail,
    getCurrentUser,
    setProfilePicture,
    getUserById,
    updateUserRole,
    deleteUser,
    registerUserWithTempPassword,getEmployeesCountByCompany,
    changePassword,
    getAllUsers,setCompanyName,
    getCompanyName,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/assign-team", authMiddleware,assignTeamToUser);
userRouter.post("/register-temp", authMiddleware,registerUserWithTempPassword);
userRouter.post("/set-company-name", authMiddleware, setCompanyName);

userRouter.get('/:companyName/employees', authMiddleware,getEmployeesCountByCompany);
userRouter.get("/company/:userId", authMiddleware, getCompanyName); 

userRouter.get('/email/:email', authMiddleware,getUserByEmail);
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.patch("/:userId/profile-picture", authMiddleware, upload.single("profilePicture"), setProfilePicture);
userRouter.get("/:userId", authMiddleware, getUserById);
userRouter.delete("/delete/:email", authMiddleware, deleteUser);
userRouter.put("/change-password", authMiddleware, changePassword);
userRouter.get("/all/company", authMiddleware, getAllUsers); 
userRouter.put("/update-role", authMiddleware,updateUserRole);

export default userRouter;