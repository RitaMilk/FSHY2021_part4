const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const logger = require('../utils/logger')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)
//part 4 supertest
const Blog = require('../models/blog')
const { response } = require('express')

beforeEach(async () => {
  await Blog.deleteMany({})
  /* let blogObject = new Blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(listHelper.initialBlogs[1])
  await blogObject.save() */
  await Blog.insertMany(listHelper.initialBlogs)
})
//part 4 supertest
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  expect(response.body).toHaveLength(2)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(listHelper.initialBlogs.length)
})
test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toEqual('React patterns')
})
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Go To Statement Considered Harmful')
})
test('the first blog has id property', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})
//part 4.10
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'JSGuru',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend#more-tests-and-refactoring-the-backend',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  //
  const blogsAtEnd = await listHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1)

  // const contents = notesAtEnd.map(n => n.content)
  const titles = blogsAtEnd.map(r => r.title)
  //
  // response = await api.get('/api/blogs')

  //const titles = response.body.map(r => r.title)

  //expect(response.body).toHaveLength(initialBlogs.length + 1)

  expect(titles).toContain(
    'async/await simplifies making async calls'
  )
})
//4.10
//
//part 4.11
test('blogs likes is set to 0 by default', async () => {
  const newBlog = {
    title: 'if property is missing',
    author: 'JSGuru',
    url: 'https://mongoosejs.com/docs/guide.html#definition'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  //const titles = response.body.map(r => r.title)
  var isByCriteria = function(record){
    return record.title === 'if property is missing'
  }
  const titlesAndLikes = response.body.filter(isByCriteria)[0]
  //const titlesAndLikes = response.body.map(r => {return { title:r.title,likes:r.likes }}).filter( r => r.titles==='if property is missing')

  expect(response.body).toHaveLength(listHelper.initialBlogs.length + 1)
  logger.info('titlesAndLikes',titlesAndLikes)
  expect(titlesAndLikes.title).toContain(
    'if property is missing'
  )
  expect(titlesAndLikes.likes).toBe(0)

})
//4.11
//part 4.12
test('catch status 400 if title is missing', async () => {

  const newBlog = {
    author: 'JSGuru',
    url: 'https://mongoosejs.com/docs/guide.html#definition',
    likes: 1
  }

  // eslint-disable-next-line indent
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  //const response = await api.get('/api/blogs')
  const blogsAtEnd = await listHelper.blogsInDb()
  //expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)

})
test('catch status 400 if url is missing', async () => {

  const newBlog = {
    title: 'catch status 400 if url is missing',
    author: 'JSGuru',
    likes: 1
  }

  // eslint-disable-next-line indent
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  //const response = await api.get('/api/blogs')
  //expect(response.body).toHaveLength(initialBlogs.length)
  const blogsAtEnd = await listHelper.blogsInDb()
  //expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)

})
//4.12
//part 4.13
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(blogToDelete.id)
    //logger.info(`deleting blog with id ${blogToDelete.id}`)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      listHelper.initialBlogs.length - 1
    )
    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})
//4.13
//part 4.14
describe('update a blog', () => {
  test('blog can be updated', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    console.log('blog to update',blogToUpdate.id)
    const upBlog = {}
    upBlog.title=blogToUpdate.title + '_1'
    upBlog.author=blogToUpdate.author + '_1'
    upBlog.likes=blogToUpdate.likes + 7

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(upBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //
    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)
    const response = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
    const updatedBlog =response.body
    expect(updatedBlog.title).toContain(upBlog.title)
  })
})
//4.14
afterAll(() => {
  mongoose.connection.close()
})