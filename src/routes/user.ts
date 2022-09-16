import express from 'express';
import { registerUser, loginUser, verifyUser, forgetPassword, resetPassword, updateUsers, setResetToken, logoutUser } from '../controller/userController';
import { auth, oneTimeTokenAuth } from '../middleware/auth';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify/:id', oneTimeTokenAuth, verifyUser);
router.patch('/forgotPassword', forgetPassword);
router.post('/resetPassword/:id', setResetToken);
router.patch('/resetPassword/:id', oneTimeTokenAuth, resetPassword);
router.patch('/update/:id', auth, updateUsers);
router.get('/logout', logoutUser)


export default router;
