const express = require("express")
let router = express.Router();

const guardService = require('../services/guardService')
const users = require('../models/users')

router.get('/', (req,res) => guardService.checkToken(req,res))
router.post('/login', (req,res) => {
    users.getUserByEmail(req,res).then(user => {
        if (guardService.checkPassword(req.query.password, user.password)){
            // TODO TRAITEMENT
            return res.status(200).send(user)
        }
        else{
            return res.status(400)
        }
    })
})

module.exports = router
