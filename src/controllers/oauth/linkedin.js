const express = require("express")
var router = express.Router();
const jwt = require('jsonwebtoken');
const authService = require('../../services/authService')
const request = require("sync-request")
const qs = require("qs")
const linkedInService = require("../../services/oauthLinkedInService")
const config = require("../../config/config")
const linkedinUser = require("../../models/linkedInUsers")
require('dotenv').config()

const authServer = {
	authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
	tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken'
}
const client = {
	"client_id": process.env.CLIENT_ID, 
	"client_secret": process.env.CLIENT_SECRET,
	"redirect_uris_login": [process.env.REDIRECT_URI_LOGIN],
	"redirect_uris_registration": [process.env.REDIRECT_URI_REGISTER]
}
let scope = ["r_liteprofile","r_emailaddress","w_member_social"]

exports.registration_callback = (req,res) => {
	if(req.body.code){
		let code = req.body.code
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
		console.log(response)
		let body = JSON.parse(response.getBody())
		console.log(body)
		console.log(req.body.id)
		if (body.access_token){
			let account_email = linkedInService.getEmail(body.access_token)
			let profile_picture = linkedInService.getProfilePicture(body.access_token)
			console.log(profile_picture)
			linkedInService.completeInvitation(account_email,req.body.id, profile_picture).then((result) => {
				res.status(200).send({token: result.token})
			})
			.catch((err) => {
				res.status(403).send(err)
			})
		}
		else {
			res.status(403).send({error: 'unknown_error_2'})
		}
	}
	else{
		res.status(403).send({error: 'unknown_error_1'})
	}
}

exports.association_callback = (req,res) => {
	console.log(req.body)
	if(req.body.code){
		let code = req.body.code
		let form_data = qs.stringify({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: 'https://ancestree.igpolytech.fr/callback_linkedin_associate',
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
		let token = req.headers.authorization;
		console.log(token)
		let payload = jwt.verify(token, authService.randomSecretKey)

		let body = JSON.parse(response.getBody())
		if (body.access_token){
			let account_email = linkedInService.getEmail(body.access_token)
			linkedinUser.newUser(payload.id,account_email)
			.then(() => res.status(201).send("done"))
			.catch((err) => res.status(400).send(err))
		}
		else {
			res.status(403).send({error: 'unknown_error_2'})
		}
	}
	else{
		res.status(403).send({error: 'unknown_error_1'})
	}

}

exports.login_callback = (req,res) => {
	console.log(req.body)
	if(req.body.code){
		let code = req.body.code
		let form_data = qs.stringify({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: client.redirect_uris_login[0],
			client_id: client.client_id,
			client_secret: client.client_secret
		})
		console.log(form_data)
		let headers = {
			'Content-Type':'application/x-www-form-urlencoded',
		}
		let response = request('POST', authServer.tokenEndpoint, {
			headers: headers,
			body: form_data
		})
		console.log(response)
		let body = JSON.parse(response.getBody())
		console.log(body)
		if (body.access_token){
			let account_email = linkedInService.getEmail(body.access_token)
			linkedInService.handlelogin(account_email).then((result) => {
				res.status(200).send({token: result.token})
			})
			.catch((err) => {
				res.status(403).send({error: 'unknown_linkedin_account'})
			})
		}
		else {
			res.status(403).send({error: 'unknown_error_2'})
		}
	}
	else{
		res.status(403).send({error: 'unknown_error_1'})
	}
}