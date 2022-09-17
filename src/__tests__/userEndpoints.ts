process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test';

import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user';
import db from '../db/database.config';
import { config } from 'dotenv'

beforeAll(async () => {
  console.log(process.env)
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
app.use('/user', userRouter);

describe('User Sign-up API Integration test', () => {
  test('POST /user/register - success - sign-up a user', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(201);
    expect(body.msg).toContain('User created successfully');
  });

  test('POST /user/register - failure - request body invalid', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: null,
      email: "jd@gmail.com",
      phonenumber: null,
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('Error');
  });

  test('POST /user/register - failure - User already exists', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
  });
});

describe('User Login API Integration test', () => {
  beforeAll(async () => {
    await request(app).post('/user/register').send({
      firstname: "John",
      lastname: "Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    const [results] =  await db.query('UPDATE usertable SET verified = true WHERE email = "jds@example.com";')
  })

  test('POST /user/login - success - login a user with email', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jds@example.com",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('token');
  });

  test('POST /user/login - success - login a user with username', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('token');
  });

  test('POST /user/login - failure - improper request body', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      username: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('Error');
  });

  test('POST /user/login - failure - user does not exist', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(404);
    expect(body.msg).toBe('User not found');
  });

  test('POST /user/login - failure - incorrect password', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "tets",
    })

    expect(statusCode).toBe(400);
    expect(body.msg).toBe('Invalid credentials');
  });

  test('POST /user/login - failure - user not verified', async () => {
    const [results] = await db.query('UPDATE usertable SET verified = false WHERE email = "jds@example.com";')

    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test",
    })
    expect(statusCode).toBe(401);
    expect(body.msg).toBe('Your account has not been verified');
  });
});
