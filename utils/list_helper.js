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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}