const mongoose = require('mongoose')
const Blog = require('./models/blog')

// connect to db
// determine what mode we are in based on the number of arguments
const GET_INFO = 2
const ADD_RECORD = 4
const MODE = process.argv.length

// do stuff
switch (MODE) {
  case GET_INFO: {
    Blog.find({}).then(result => {
      console.log('blogs:')
      result.forEach(blog => {
        console.log(`
          id: ${blog._id.toString()}
          title: ${title},
          author: ${author},
          url: ${url},
          likes: ${likes},
        `)
      })
      mongoose.connection.close()
    })
    break
  }
}
