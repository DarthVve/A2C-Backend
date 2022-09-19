
import express, { Request, Response, NextFunction } from 'express';
import { auth, oneTimeTokenAuth } from '../middleware/auth';

import { registerUser, loginUser, verifyUser, forgetPassword, resetPassword, updateUsers, setResetToken, logoutUser, getSingleUser } from '../controller/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user/:id', getSingleUser)
router.patch("/forgotPassword", forgetPassword);
router.get("/resetPassword/:id", (req , res)=>{ res.send("form will be rendered here") });
router.patch("/resetPassword/:id", resetPassword);
router.post('/verify/:id', oneTimeTokenAuth, verifyUser);
router.patch('/forgotPassword', forgetPassword);
router.post('/resetPassword/:id', setResetToken);
router.patch('/resetPassword/:id', oneTimeTokenAuth, resetPassword);
router.patch('/update/:id', auth, updateUsers);
router.get('/logout', logoutUser)

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ message: 'Welcome to Express' });
});

export default router;



