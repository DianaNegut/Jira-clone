import express from "express"
import multer from 'multer';
import path from 'path';
import {loginUser, registerUser,assignTeamToUser,getCurrentUser, setProfilePicture, getUserById} from '../controllers/userController.js'


const userRouter = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post('/assign-team', assignTeamToUser);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/:userId/profile-picture', upload.single('profilePicture'), setProfilePicture);
userRouter.get('/:userId', getUserById);


export default userRouter;