const blog_list = require('./blog_list')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogs = blog_list.blogs
  
  test('of empty list is zero', () =>{
    expect(listHelper.totalLikes([])).toBe(0)
  })
  
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(blogs.slice(0,1))).toBe(7)
  })

  test('of a bigger list is calculated correctly', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

test('favorite blog', () => {
  const blogs = blog_list.blogs
  const favoriteBlog = listHelper.favoriteBlog(blogs)
  expect(favoriteBlog).toEqual(blog_list.blogs[2])
  expect(favoriteBlog.likes).toBe(12)
})