import express from 'express';
import request from 'supertest';
import userRouter from '../routes/user';
import db from '../db/database.config';


beforeAll(async () => {
  await db.sync({ force: true })
    .then(() => {
      console.info("Test Db Connected")
    })
    .catch((err) => {
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
      email: "jds@gmail.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(201);
    expect(body.msg).toBe('User created successfully');
    expect(body).toHaveProperty('record');
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
      email: "jds@gmail.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
  });
});

// it('update user profile', async () => {
//   const user = await request.post('/user/register').send({
//     email: 'eunice@gmail.com',
//     password: '4567',
//   });
//   const response = await request.patch(`/user/update/${user.body.User.id}`).set('authorization', `Bearer ${user.body.token}`)
//     .send({
//       firstName: 'POD',
//       lastName: 'E',
//       username: 'E TESTING',
//       phoneNumber: '09036036393',
//       avatar:
//         'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
//     });
//   expect(response.status).toBe(200);
//   expect(response.body.message).toBe('Update Successful');
//   expect(response.body).toHaveProperty('record');
// });
