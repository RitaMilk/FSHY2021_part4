const Blog = require('../models/blog')
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
  const blog=blogs.reduce(reducer,blogs[0])
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
module.exports = {
  initialBlogs,
  dummy,
  totalLikes,
  favoriteBlog,
  blogsInDb
}