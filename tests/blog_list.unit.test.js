const blog_list = require('./blog_list');
const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  const { blogs } = blog_list;

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(blogs.slice(0, 1))).toBe(7);
  });

  test('of a bigger list is calculated correctly', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });
});

test('favorite blog', () => {
  const { blogs } = blog_list;
  const favoriteBlog = listHelper.favoriteBlog(blogs);
  expect(favoriteBlog).toEqual(blog_list.blogs[2]);
  expect(favoriteBlog.likes).toBe(12);
});

test('author blog counts', () => {
  const { blogs } = blog_list;
  const authorBlogCounts = listHelper.authorBlogCounts(blogs);
  expect(authorBlogCounts).toEqual(new Map([
    ['Michael Chan', 1],
    ['Edsger W. Dijkstra', 2],
    ['Robert C. Martin', 3],
  ]));
});

test('most blogs', () => {
  const { blogs } = blog_list;
  const authorWithMostBlogs = listHelper.mostBlogs(blogs);
  expect(authorWithMostBlogs).toEqual({ author: 'Robert C. Martin', blogs: 3 });
});

test('most likes', () => {
  const { blogs } = blog_list;
  const authorWithMostLikes = listHelper.mostLikes(blogs);
  expect(authorWithMostLikes).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
});

