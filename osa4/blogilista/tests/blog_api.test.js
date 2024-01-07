// TODO: these tests could use refactoring

const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('admin', 10)
  const user = new User({ username: 'admin', passwordHash })

  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifying field of blogs is id instead of _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const loginCredentials = {
    username: 'admin',
    password: 'admin'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)

  const newBlog = {
    title: 'A valid blog',
    author: 'Valid Validsson',
    url: 'http://valid.blog',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  // eslint-disable-next-line no-unused-vars
  const blogsWithoutIds = blogsAtEnd.map(({ user, id, ...rest }) => rest)
  expect(blogsWithoutIds).toContainEqual(newBlog)
})

test('a valid blog with no likes can be added and defaults to 0 likes', async () => {
  const loginCredentials = {
    username: 'admin',
    password: 'admin'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)

  const newBlog = {
    title: 'A valid blog',
    author: 'Valid Validsson',
    url: 'http://valid.blog'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  // eslint-disable-next-line no-unused-vars
  const blogsWithoutIds = blogsAtEnd.map(({ user, id, ...rest }) => rest)
  expect(blogsWithoutIds).toContainEqual(
    {
      ...newBlog,
      likes: 0
    }
  )
})

test('a blog without url is not added', async () => {
  const loginCredentials = {
    username: 'admin',
    password: 'admin'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)

  const newBlog = {
    title: 'A valid blog',
    author: 'Valid Validsson',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(400)
})

test('a blog without title is not added', async () => {
  const loginCredentials = {
    username: 'admin',
    password: 'admin'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)

  const newBlog = {
    author: 'Valid Validsson',
    url: 'http://valid.blog',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(400)
})

test('a blog without valid JWT is not added', async () => {
  const newBlog = {
    author: 'Valid Validsson',
    url: 'http://valid.blog',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${'notvalid'}` })
    .expect(401)
})

test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
  const loginCredentials = {
    username: 'admin',
    password: 'admin'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(loginCredentials)
    .expect(200)

  const newBlog = {
    title: 'A valid blog',
    author: 'Valid Validsson',
    url: 'http://valid.blog',
    likess: 42
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })

  const blogToDelete = response.body

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  // eslint-disable-next-line no-unused-vars
  const blogsWithoutIds = blogsAtEnd.map(({ id, ...rest }) => rest)
  delete blogToDelete.id
  expect(blogsWithoutIds).not.toContainEqual(blogToDelete)
})

describe('updating a blog', () => {
  test('in all fields succeeds with status code 201 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      title: 'A valid updated blog',
      author: 'Valid Updatedsson',
      url: 'http://updated.blog',
      likes: 84
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    // eslint-disable-next-line no-unused-vars
    const blogsWithoutIds = blogsAtEnd.map(({ id, ...rest }) => rest)
    delete blogToUpdate.id
    expect(blogsWithoutIds).toContainEqual(newBlog)
    expect(blogsWithoutIds).not.toContainEqual(blogToUpdate)
  })

  test('in only like field succeeds with status code 201 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      likes: blogToUpdate.likes + 42
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    // eslint-disable-next-line no-unused-vars
    const blogsWithoutIds = blogsAtEnd.map(({ id, ...rest }) => rest)
    delete blogToUpdate.id
    expect(blogsWithoutIds).toContainEqual({
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 42
    })
    expect(blogsWithoutIds).not.toContainEqual(blogToUpdate)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})