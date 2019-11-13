const express = require("express")
let router = express.Router();
const jwt = require('jsonwebtoken');


const randomSecretKey = require('../index').randomSecretKey
const users = require('../models/users')
const authService = require('../services/authService')

router.post('/login', (req,res) => {
    users.getUserByEmail(req,res).then(users => {
        let user = users[0]
        if (authService.checkPassword(req.query.password, user.password)){
            user.token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
            console.log(user)
            return res.status(200).send(user)
        }
        else{
            return res.status(400).send("Invalid password")
        }
    })
})

router.get('/checkToken', (req,res) => {
    authService.checkToken(req,res)
})

module.exports = router
