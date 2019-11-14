const express = require("express")
let router = express.Router();
const request = require("sync-request")
const qs = require("qs")
const axios = require('axios');
const jwt = require('jsonwebtoken');
const randomSecretKey = require('../index').randomSecretKey
const emailService = require("../services/emailService")
const authService = require("../services/authService")
const invitation = require('../models/invitation')
const users = require('../models/users')

router.post('/', (req, res) => {
    users.newInvitedUser(req.body.email).then(user => {
        let emailPromise = emailService.sendInvitation(req.body.email,req.body.firstname,req.body.lastname,user.id)
        let graphPromise = axios.post('https://ancestree-api-neo4j.igpolytech.fr/api/users', {
            id: user.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            birthdate: req.body.birthdate,
            phone: req.body.phone
        })
        let saveInvitationPromise = invitation.newInvitation(user.id)

        Promise.all([emailPromise, graphPromise, saveInvitationPromise])
        .then(() =>{
            res.status(201).send(user)
        }).catch((error) => res.status(400).send(error))
    })
    .catch(error => res.status(400).send(error))
})

router.get('/check', (req,res) => {
    invitation.getInvitation(req.body.id)
    .then((id) => {
        if(id.length == 1){
            res.status(200).send()
        }
        else{
            res.status(404).send()
        }
    })
    .catch((error) => res.status(400).send(error))
})

router.put('/', (req,res) => {
    let deleteInvitationPromise = invitation.deleteInvitation(req.body.id)
    let updateUserPromise = users.updateUser(req.body.id, req.body.email, authService.hashPassword(req.body.password))

    Promise.all([updateUserPromise, deleteInvitationPromise])
    .then((result) => {
        let user = result[1]
        token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
        res.status(201).send(token)
    })
    .catch(error => {
        console.log(error)
        res.status(400).send(error)})
})

module.exports = router