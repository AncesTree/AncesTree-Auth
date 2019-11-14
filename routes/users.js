const express = require("express")
let router = express.Router();

const users = require('../models/users')

router.get('/', (req,res) => {
    users.getUser(req.query.id)
    .then(user => res.status(200).send(user))
    .catch(error => res.status(404).send(error))
})

module.exports = router