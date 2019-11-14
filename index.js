const express = require("express")
const request = require("sync-request")
const qs = require("qs")
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json())

const oauth = require("./routes/oauth")
const invitation = require("./routes/invitation")
const users = require("./routes/users")
const auth = require("./routes/auth")

app.use('/oauth', oauth)
app.use('/invitation', invitation)
app.use('/users', users)
app.use('/auth', auth)

app.use('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/api.html')
})

const server = app.listen(8080, () => {
  console.log("Auth server started")
})

