// Desc: Main application file

require('dotenv').config()

// external imports
const cors      = require('cors')
const express   = require('express')
const mongoose  = require('mongoose')
const morgan    = require('morgan')

// internal imports
const config      = require('./utils/config')
const blogRouter  = require('./controllers/blogs')
const logger      = require('./utils/logger')

const app = express()

// basic request logging
morgan.token('body', req => `body: ${JSON.stringify(req.body)}`)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

try {
  mongoose.connect(config.MONGODB_URI)
} catch (err) {
  logger.error('Error connecting to MongoDB:', err.message)
}

app.use(cors())
app.use(express.json())
app.use(blogRouter)

module.exports = app