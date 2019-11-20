const express = require("express")
let router = express.Router();

const users = require('../models/users')

exports.getUser = (req,res) => {
    users.getUser(req.body.id)
    .then(user => res.status(200).send(user))
    .catch(error => res.status(404).send(error))
}