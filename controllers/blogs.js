const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  /* Blog.find({}).then(blogs => {
    response.json(blogs)
  }) */
  const blogs = await Blog.find({})
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
  const blog = await   Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON)
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
  const blog={}
  if (body.title){
    blog.title = body.title
  }
  if (body.author){
    blog.author = body.author
  }
  if (body.url){
    blog.url = body.url
  }
  if (body.likes){
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