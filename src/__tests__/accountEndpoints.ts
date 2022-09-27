process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test';

import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user';
import accountRouter from '../routes/account';
import db from '../db/database.config';
import cookieParser from 'cookie-parser';

beforeAll(async () => {
  await db.sync({ force: true })
    .then(() => {
      console.info("Test Db Connected")
    })
    .catch((err: any) => {
      console.error(err)
    })
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRouter);
app.use('/account', accountRouter);
let cookie: string;

describe('Account Creation API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "johnny",
      email: "johndoe@example.com",
      phonenumber: "08001001738",
      password: "test",
      confirm_password: "test"
    })
    await db.query('UPDATE usertable SET verified = true WHERE email = "johndoe@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "johndoe@example.com",
      password: "test",
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    console.log("Cookie", cookie);
  })

  test('POST /account/add - failure - invalid account details', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      bank: "",
      number: "1234567890",
      name: "John Doe",
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('Error');
    expect(body.Error).toContain('bank');
  })

  test('POST /account/add - failure - account name does not match user details', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Lennon",
      bank: "GTB",
      number: "1234567890"
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('name');
  })

  test('POST /account/add - success - account created', async () => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Doe",
      bank: "GTB",
      number: "1234567890"
    })
    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('created');
    expect(body).toHaveProperty('data');
  })

  test('POST /account/add - failure - account already exists', async() => {
    const { body, statusCode } = await request(app).post('/account/add').set("Cookie", cookie).send({
      name: "John Doe",
      bank: "GTB",
      number: "1234567890"
    })
    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('already exists');
  })

  test('POST /account/add - failure - not logged in', async () => {
    const { body, statusCode } = await request(app).post('/account/add').send({
      name: "John Doe",
      bank: "Sterling Bank",
      number: "0987654321"
    })
    expect(statusCode).toBe(401);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('login');
  })
});
