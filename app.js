// Desc: Main application file

require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(blogRouter)

module.exports = app