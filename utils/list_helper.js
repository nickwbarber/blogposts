const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((fav, curr) =>
    fav.likes > curr.likes
      ? fav
      : curr
  )
}

const authorBlogCounts = blogs => {
  const authorBlogCounts = new Map(blogs.map(blog => [blog.author, 0]))
  blogs.map(blog => {
    const author = blog.author
    const totalBlogs = authorBlogCounts.get(author) + 1
    authorBlogCounts.set(author, totalBlogs)
  })
  return authorBlogCounts
}

const mostBlogs = blogs => {
  const authorWithMostBlogs = Array.from(authorBlogCounts(blogs).entries())
    .map(([ author, blogs ] ) => { return { author, blogs } })
    .reduce((prevAuthor, currAuthor) => {
      return prevAuthor.blogs > currAuthor.blogs
        ? prevAuthor
        : currAuthor
    })
  return authorWithMostBlogs
}

const authorLikeCounts = blogs => {
  const authorLikeCounts = new Map(blogs.map(blog => [blog.author, 0]))
  blogs.map(blog => {
    const author = blog.author
    const totalLikes = authorLikeCounts.get(author) + blog.likes
    authorLikeCounts.set(blog.author, totalLikes)
  })
  return authorLikeCounts
}

const mostLikes = blogs => {
  const authorWithMostLikes = Array.from(authorLikeCounts(blogs).entries())
    .map(([ author, likes ] ) => { return { author, likes } })
    .reduce((prevAuthor, currAuthor) => {
      return prevAuthor.likes > currAuthor.likes
        ? prevAuthor
        : currAuthor
    })
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorBlogCounts,
  mostBlogs,
  mostLikes,
}
