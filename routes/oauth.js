const express = require("express")
var router = express.Router();
const jwt = require('jsonwebtoken');
const authService = require('../services/authService')
const request = require("sync-request")
const qs = require("qs")
const linkedInService = require("../services/oauthLinkedInService")
const config = require("../config/config")
require('dotenv').config()

const authServer = {
	authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
	tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken'
}
const client = {
	"client_id": process.env.CLIENT_ID, 
	"client_secret": process.env.CLIENT_SECRET,
	"redirect_uris_login": [process.env.REDIRECT_URI_LOGIN],
	"redirect_uris_registration": [process.env.REDIRECT_URI_REGISTRATION]
}
let scope = ["r_liteprofile","r_emailaddress","w_member_social"]

router.get('/register/:id', (req, res) => {
 	res.redirect(authServer.authorizationEndpoint+'?response_type=code&client_id='+client.client_id+'&redirect_uri='+client.redirect_uris_registration+'&state=fooobar&scope='+scope)
})

router.get('/registration_callback', (req, res) => {
	if(req.query.code){
		let code = req.query.code
		let form_data = qs.stringify({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: client.redirect_uris_registration[0],
			client_id: client.client_id,
			client_secret: client.client_secret
		})
		let headers = {
			'Content-Type':'application/x-www-form-urlencoded',
		}
		let response = request('POST', authServer.tokenEndpoint, {
			headers: headers,
			body: form_data
		})
		let body = JSON.parse(response.getBody())
	
		let account_email = linkedInService.getEmail(body.access_token)
		let profile_picture = linkedInService.getProfilePicture(body.access_token)
	
		linkedInService.completeInvitation(account_email, req.query.id, profile_picture)
		.then((result) => {
			res.redirect(config.CLIENT_URL+'/token/'+result.token)
		})
		.catch((err) => {
			console.log(err.error)
			res.redirect(config.CLIENT_URL+'/join/'+req.query.id)
		})	
	}
	else{
		res.redirect(config.CLIENT_URL+'/join/'+req.query.id)
	}
	
})

router.get('/login', (req,res) => {
	res.redirect(authServer.authorizationEndpoint+'?response_type=code&client_id='+client.client_id+'&redirect_uri='+client.redirect_uris_login+'&state=fooobar&scope='+scope)
})

router.get('/login_callback', (req, res) => {
	if(req.query.code){
		let code = req.query.code
		let form_data = qs.stringify({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: client.redirect_uris_login[0],
			client_id: client.client_id,
			client_secret: client.client_secret
		})
		let headers = {
			'Content-Type':'application/x-www-form-urlencoded',
		}
		let response = request('POST', authServer.tokenEndpoint, {
			headers: headers,
			body: form_data
		})
		let body = JSON.parse(response.getBody())
		if (body.access_token){
			let account_email = linkedInService.getEmail(body.access_token)
			linkedInService.handlelogin(account_email).then((result) => {
				res.redirect(config.CLIENT_URL+'/token/'+result.token)
			})
			.catch((err) => res.status(err.status).send(err.error))
		}
		else {
			res.redirect(config.CLIENT_URL+'/login')
		}
	}
	else{
		res.redirect(config.CLIENT_URL+'/login')
	}
})

module.exports = router
