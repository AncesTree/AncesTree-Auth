const express = require("express")
const request = require("sync-request")
const qs = require("qs")
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json())

const linkedin = require('./controllers/oauth/linkedin')
const mydash = require('./controllers/oauth/mydash')
const invitation = require('./controllers/invitation')
const users = require('./controllers/users')
const auth = require('./controllers/auth')

const fasync = route =>
  (req, res, next) => {
    console.log('1')
    Promise.resolve(route(req, res)).catch(next)
  }

// linkedIn routes
app.post('/oauth/linkedin/registration_callback', linkedin.registration_callback)
app.post('/oauth/linkedin/login_callback', linkedin.login_callback)

// auth routes
app.post('/auth/login', auth.login)
app.post('/auth/register', auth.register)
app.get('/auth/checktoken', auth.checktoken)

// mydash routes
app.post('/oauth/mydash/callback/', mydash.callback)

// invitation routes
app.post('/invitation', invitation.newInvitation)
app.get('/check', invitation.check)
app.post('/basic', invitation.basic)

// users routes
app.get('/users', users.getUser)

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found.',
    message: 'Route was not found'
  })
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'server_error',
    message: 'Server broke!'
  })
})

module.exports = app