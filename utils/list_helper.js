const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
]
const twoUsers = [
  {
    username: 'mxt',
    name: 'Mark Twen',
    passwordHash: '$2b$10$BRCN2uFzSLvkiwfl4YaKEereYKDrbVfRvJ9K3guxptTAPvPUEC87i'
  },
  {
    username: 'jxs',
    name: 'Join Steinbeck',
    passwordHash: '$2b$10$Aguqm.Y7AxI4bqAHrOw3T.MmJf1iZ7uWXe5US28d6WfxB8Vph0xUW'
  }
]
const dummy = (blogs) => {
  // ...
  return 1
}
const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
  const reducer = (ret, item) => {
    return (ret.likes > item.likes ? ret : item)
  }
  const blog = blogs.reduce(reducer, blogs[0])
  const expectedBlog = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
  return expectedBlog
}
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
module.exports = {
  initialBlogs,
  twoUsers,
  dummy,
  totalLikes,
  favoriteBlog,
  blogsInDb,
  usersInDb
}