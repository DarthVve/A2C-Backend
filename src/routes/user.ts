import express from 'express';
import { registerUser, loginUser, verifyUser, forgetPassword, resetPassword } from '../controller/userController';
//import {auth} from '../middleware/auth';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:id', verifyUser);
router.patch("/forgotPassword", forgetPassword);
router.get("/resetPassword/:id", (req , res)=>{ res.send("form will be rendered here") });
router.patch("/resetPassword/:id",resetPassword);


export default router;
