import express from "express"
import {loginUser, registerUser,assignTeamToUser,getCurrentUser} from '../controllers/userController.js'


const userRouter = express.Router()



userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post('/assign-team', assignTeamToUser);
userRouter.get('/me', getCurrentUser);


export default userRouter;