// Desc: Main application file

require('dotenv').config()

// external imports
const cors      = require('cors')
const express   = require('express')
const mongoose  = require('mongoose')

// internal imports
const config      = require('./utils/config')
const blogRouter  = require('./controllers/blogs')
const logger      = require('./utils/logger')
const middleware  = require('./utils/middleware')

const app = express()

// basic request logging

try {
  mongoose.connect(config.MONGODB_URI)
} catch (err) {
  logger.error('Error connecting to MongoDB:', err.message)
}

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app