import express from 'express';
import { registerUser, loginUser, verifyUser, forgetPassword, resetPassword, updateUsers } from '../controller/userController';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:id', verifyUser);
router.patch("/forgotPassword", forgetPassword);
router.get("/resetPassword/:id", (req , res)=>{ res.send("form will be rendered here") });
router.patch("/resetPassword/:id", resetPassword);
router.patch('/update/:id', updateUsers);


export default router;
