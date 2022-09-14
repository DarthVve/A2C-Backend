import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './db/database.config';
import userRouter from './routes/user';

db.sync()
  .then(() => {
    console.log('Database connected succcesfully');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);

export default app;
