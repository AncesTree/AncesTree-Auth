const express = require("express")
let router = express.Router();

const email = require("../email")
const users = require('../models/users')

router.post('/newInvitation', (req, res) => {
    users.newUser(req, res)
    email.sendInvitation(req.query.email,req.query.firstname,req.query.lastname)
})

module.exports = router