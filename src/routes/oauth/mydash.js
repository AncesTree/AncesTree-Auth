
const express = require("express")
const jwt = require('jsonwebtoken');
const authService = require('../services/authService')
const request = require("sync-request")
const qs = require("qs")
const linkedInService = require("../services/oauthLinkedInService")
const config = require("../config/config")
require('dotenv').config()

const authServer = {
	authorizationEndpoint: 'http://oauth-dev.igpolytech.fr/oauth/authorize',
	tokenEndpoint: 'http://oauth-dev.igpolytech/oauth/token',
	refreshEndpoint: 'http://oauth-dev.igpolytech/oauth/refresh'
}
const client = {
	"client_id": process.env.CLIENT_ID, 
	"client_secret": process.env.CLIENT_SECRET,
	"redirect_uris_login": [process.env.REDIRECT_URI_LOGIN],
	"redirect_uris_registration": [process.env.REDIRECT_URI_REGISTRATION]
}
let access_token

exports.register = async (req, res) => {
 	return res.redirect(authServer.authorizationEndpoint+'?response_type=code&client_id=network&redirect_uri=http://localhost:3000/registration_callback&state=fooobar')
}

exports.registration_callback = async (req, res) => {
	console.log(req.query.id)
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

	access_token = body.access_token

	let account_email = linkedInService.getEmail(access_token)
	let profile_picture = linkedInService.getProfilePicture(access_token)

	linkedInService.completeInvitation(account_email, req.query.id, profile_picture)
	.then((result) => {
		return res.redirect(config.CLIENT_URL+'/token/'+result.token).end()
	})
	.catch((err) => {
		return res.status(err.status).send(err.error).end()
	})	
}

exports.refresh  = async (req, res) => {
	const refreshToken = req.body.refresh_token

	let form_data = qs.stringify({
		token: refreshToken,
		client_id: client.client_id
	})

	const headers = {
		'Content-Type':'application/x-www-form-urlencoded'
	}
	let response = request('POST', authServer.refreshEndpoint, {
		headers: headers,
		body: form_data
	})

}
