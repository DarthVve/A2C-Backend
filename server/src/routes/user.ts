import express from 'express';
const router = express.Router();
import { RegisterUser } from '../controller/userController';

router.post('/register', RegisterUser);

export default router;
