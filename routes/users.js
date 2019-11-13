const express = require("express")
let router = express.Router();

const users = require('../models/users')

router.get('/', (req,res) => {
    users.getUser(req, res)
})

module.exports = router