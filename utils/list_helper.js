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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
