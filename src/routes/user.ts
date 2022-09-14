import express from 'express';
import { registerUser, loginUser } from '../controller/userController';
//import {auth} from '../middleware/auth';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
