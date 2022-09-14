import express from 'express';
import { registerUser, loginUser, verifyUser } from '../controller/userController';
//import {auth} from '../middleware/auth';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifypage/:id', verifyUser);

export default router;
