const express = require("express")
let router = express.Router();
const jwt = require('jsonwebtoken');


const randomSecretKey = require('../index').randomSecretKey
const users = require('../models/users')
const authService = require('../services/authService')

router.post('/login', (req,res) => {
    users.getUserByEmail(req,res).then(users => {
        let user = users[0]
        if (authService.checkPassword(req.body.password, user.password)){
            token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
            return res.status(200).send(token)
        }
        else{
            return res.status(400).send("Invalid password")
        }
    })
})

router.post('/register', (req,res) => {
    users.newUser(req.body.email, authService.hashPassword(req.body.password))
    .then((user) => {
        token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
        res.status(201).send(token)
    })
    .catch(error => res.status(400).send(error))
})

router.get('/checktoken', (req,res) => {
    authService.checkToken(req).then((payload) => res.status(200).send(payload.id)).catch((error) => res.status(403).send(error))
})

module.exports = router
