const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const linkedin = require('./routes/oauth/linkedin')
const mydash = require('./routes/oauth/mydash')
const invitation = require('./routes/invitation')
const users = require('./routes/users')
const auth = require('./routes/auth')

// Allow all request to access this server
app.use(cors())

// Setup form url decoder
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Setup routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: 'working',
    message: 'The Auth API is working'
  })
})

const fasync = route =>
  (req, res, next) =>
    Promise.resolve(route(req, res)).catch(next)

// linkedIn routes
app.get('/oauth/linkedin/authorize', fasync(linkedin.authorize))
app.get('/oauth')
// auth routes
app.post('/auth/login', fasync(auth.login))
app.post('/auth/register', fasync(auth.register))
app.get('/auth/checktoken', fasync(auth.checktoken))

// mydash routes
app.post('/oauth/mydash', fasync(mydash.token))
app.get('/oauth/mydash', fasync(mydash.authorize))

// invitation routes
app.post('/invitation', fasync(invitation.invitation))
app.get('/check', fasync(invitation.check))
app.post('/basic', fasync(invitation.basic))

// users routes
app.get('/users', fasync(users.users))

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
