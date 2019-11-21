const jwt = require('jsonwebtoken');
const authService = require('../../services/authService')
const myDashService = require("../../services/oauthMyDashService")
const myDash = require("../../models/myDashUsers")
const axios = require('axios');
require('dotenv').config()

exports.callback = (req,res) => {
		if (req.body.access_token){
            jwt.verify(req.body.access_token,process.env.CLIENT_SECRET_MYDASH, (err, authorizedData) => {
                if(err){
                    res.sendStatus(403);
                } else {
                    let name = authorizedData.firstname+'.'+authorizedData.lastname
                    myDashService.isRegistered(name).then((isRegister) => {
                        if(isRegister){
                            myDash.getUserByName(name).then((result) => {
                                let token = jwt.sign({id: result.id}, authService.randomSecretKey, {expiresIn: '4h'});
                                res.status(201).send({token: token, isRegistered: true})                            
                            })
                        }
                        else{
                            myDashService.createAccount(name).then((result) => {
                                let token = jwt.sign({id: result.id}, authService.randomSecretKey, {expiresIn: '4h'});
                                const options = {headers: {Authorization: token, 'Content-Type': 'application/json'}}
                                axios.post('https://ancestree-chat.igpolytech.fr/users',{
                                    id: user.id,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    pseudo: '',
                                    rooms: []
                                }, options)
                                .then(() => res.status(201).send({token: token, isRegistered: false}))      
                                .catch((error) => res.status(400).send(error))                   
                            })
                        }
                    })
                }
            })
        }
		else {
			res.status(403).send("Error")
        }
	}
