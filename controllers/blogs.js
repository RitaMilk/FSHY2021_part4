const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
//const listHelper = require('../utils/list_helper')

//part 4.18
/* const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
} */
//4.18
blogsRouter.get('/', async (request, response) => {
  /* Blog.find({}).then(blogs => {
    response.json(blogs)
  }) */
  const blogs = await Blog.find({}).
    populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

/* blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
}) */
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  //part 4.18
  //part 4.20 const token = getTokenFrom(request)
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //part 4.18
  //part 4.17 only, where any first user was ok const usersInDB = await User.find()
  //part 4.17 only, where any first user was ok const user = usersInDB[0]
  //--console.log('users =', user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  /*const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })*/

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

/* blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
}) */

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {}
  if (body.title) {
    blog.title = body.title
  }
  if (body.author) {
    blog.author = body.author
  }
  if (body.url) {
    blog.url = body.url
  }
  if (body.likes) {
    blog.likes = body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON)
  /* Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error)) */
})

module.exports = blogsRouter