import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
/* Get Home Page. */

router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ message: 'Hello User' });
});

export default router;
