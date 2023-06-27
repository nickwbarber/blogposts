const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => blogs.reduce((fav, curr) => (fav.likes > curr.likes
  ? fav
  : curr));

const authorBlogCounts = (blogs) => {
  const authorBlogCounts = new Map(blogs.map((blog) => [blog.author, 0]));
  blogs.map((blog) => {
    const { author } = blog;
    const totalBlogs = authorBlogCounts.get(author) + 1;
    authorBlogCounts.set(author, totalBlogs);
  });
  return authorBlogCounts;
};

const mostBlogs = (blogs) => {
  const authorWithMostBlogs = Array.from(authorBlogCounts(blogs).entries())
    .map(([author, blogs]) => ({ author, blogs }))
    .reduce((prevAuthor, currAuthor) => (prevAuthor.blogs > currAuthor.blogs
      ? prevAuthor
      : currAuthor));
  return authorWithMostBlogs;
};

const authorLikeCounts = (blogs) => {
  const authorLikeCounts = new Map(blogs.map((blog) => [blog.author, 0]));
  blogs.map((blog) => {
    const { author } = blog;
    const totalLikes = authorLikeCounts.get(author) + blog.likes;
    authorLikeCounts.set(blog.author, totalLikes);
  });
  return authorLikeCounts;
};

const mostLikes = (blogs) => {
  const authorWithMostLikes = Array.from(authorLikeCounts(blogs).entries())
    .map(([author, likes]) => ({ author, likes }))
    .reduce((prevAuthor, currAuthor) => (prevAuthor.likes > currAuthor.likes
      ? prevAuthor
      : currAuthor));
  return authorWithMostLikes;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  authorBlogCounts,
  mostBlogs,
  mostLikes,
};
