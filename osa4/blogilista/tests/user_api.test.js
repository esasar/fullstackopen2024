const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

describe('posting a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('succeeds with statuscode 201 with valid information', async () => {
    const newUser = {
      username: '123',
      password: '123',
      name: '123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 400 if password is missing', async () => {
    const newUser = {
      username: '123',
      name: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing or too short')
  })

  test('fails with statuscode 400 if password is too short', async () => {
    const newUser = {
      username: '123',
      password: '12',
      name: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing or too short')
  })

  test('fails with statuscode 400 if username is missing', async () => {
    const newUser = {
      password: '123',
      name: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username: Path `username` is required.')
  })

  test('fails with statuscode 400 if username is too short', async () => {
    const newUser = {
      username: '12',
      password: '123',
      name: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3).')
  })

  test('fails with statuscode 400 if username is not unique', async () => {
    const newUser = {
      username: 'root',
      password: '123',
      name: '123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique.')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})