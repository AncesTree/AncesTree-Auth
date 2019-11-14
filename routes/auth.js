const express = require("express")
let router = express.Router();
const jwt = require('jsonwebtoken');


const randomSecretKey = require('../index').randomSecretKey
const users = require('../models/users')
const authService = require('../services/authService')

router.post('/login', (req,res) => {
    users.getUserByEmail(req.body.email).then(user => {
        if(user){
            if (authService.checkPassword(req.body.password, user.password)){
                token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
                return res.status(200).send({token: token})
            }
            else{
                return res.status(400).send("Invalid password")
            }
        }
        else{
            res.status(400).send("User not found!")
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
