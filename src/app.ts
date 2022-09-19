import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './db/database.config';
import userRouter from './routes/user';
import cors from 'cors';
import corsOptions from './utility/corsOptions';

db.sync()
  .then(() => {
    console.log('Database connected succesfully');
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

app.use(cors(corsOptions));

app.use('/user', userRouter);

export default app;
