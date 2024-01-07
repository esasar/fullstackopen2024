const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, currentBlog) => {
    return currentBlog.likes > favorite.likes ? currentBlog : favorite
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = lodash.groupBy(blogs, blog => blog.author)
  const authors = Object.keys(groupedByAuthor)

  const biggestBlogger = lodash.maxBy(authors, author => groupedByAuthor[author].length)

  return {
    author: biggestBlogger,
    blogs: groupedByAuthor[biggestBlogger].length
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = lodash.groupBy(blogs, 'author')
  const authorWithMostLikes = lodash.maxBy(
    Object.keys(groupedByAuthor), author => {
      return lodash.sumBy(groupedByAuthor[author], 'likes')
    }
  )

  return {
    author: authorWithMostLikes,
    likes: lodash.sumBy(groupedByAuthor[authorWithMostLikes], 'likes')
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

