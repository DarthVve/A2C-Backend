import express from 'express';
import { registerUser, updateUsers } from '../controller/userController';
const router = express.Router();

router.post('/register', registerUser);

router.patch('/update/:id',updateUsers)

export default router;
