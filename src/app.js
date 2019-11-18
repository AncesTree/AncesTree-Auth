const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { inProduction, inTest } = require('./util')
const logger = require('./logger')


const linkedin = require("../routes/oauth/linkedin")
const mydash = require("../routes/oauth/mydash")
const invitation = require("../routes/invitation")
const users = require("../routes/users")
const auth = require("../routes/auth")


// Allow all request to access this server
app.use(cors())


// Setup form url decoder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


//Setup routes
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/api.html')
})

const fasync = route =>
  (req, res, next) =>
    Promise.resolve(route(req, res)).catch(next)

//linkedIn routes
app.get('/oauth/linkedin/authorize', fasync(linkedin.authorize))
app.get()
//auth routes
app.post('/oauth/auth', fasync(auth.auth))

//mydash routes
app.post('/oauth/token', fasync(auth.token))
app.post('/oauth/refresh', fasync(auth.refresh))

//invitation routes

//users routes

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found.'
  })
})

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Something broke!'
  })
})