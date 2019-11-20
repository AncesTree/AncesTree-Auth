const express = require("express")
const jwt = require('jsonwebtoken');
const authService = require('../../services/authService')
const myDashService = require("../../services/oauthMyDashService")
const myDash = require("../../models/myDashUsers")
const config = require("../../config/config")
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
                                res.status(201).send({token: token, isRegistered: false})                            
                            })
                        }
                    })
                }
            })
        }
		else {
			res.redirect(config.CLIENT_URL+'/login')
        }
	}
