import express, { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, verifyUser, forgetPassword, resetPassword, updateUsers, getSingleUser } from '../controller/userController';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:id', verifyUser);
router.get('/user/:id', getSingleUser)
router.patch("/forgotPassword", forgetPassword);
router.get("/resetPassword/:id", (req , res)=>{ res.send("form will be rendered here") });
router.patch("/resetPassword/:id", resetPassword);
router.patch("/update/:id", updateUsers)

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ message: 'Welcome to Express' });
});

export default router;



