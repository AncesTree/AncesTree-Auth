const express = require("express")
const request = require("sync-request")
const qs = require("qs")
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
app.use(bodyParser.json())
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

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

