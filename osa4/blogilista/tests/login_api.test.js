const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

describe('logging in', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('admin', 10)
    const user = new User({ username: 'admin', passwordHash })

    await user.save()
  })

  test('as a valid user return statuscode 200 and jwt', async () => {
    const validCredentials = {
      username: 'admin',
      password: 'admin'
    }

    await api
      .post('/api/login')
      .send(validCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})