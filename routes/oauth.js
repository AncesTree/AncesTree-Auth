const express = require("express")
var router = express.Router();

const request = require("sync-request")
const qs = require("qs")
require('dotenv').config()

const authServer = {
	authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
	tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken'
}
const client = {
	"client_id": process.env.CLIENT_ID, 
	"client_secret": process.env.CLIENT_SECRET,
	"redirect_uris": [process.env.REDIRECT_URI]
}
let access_token, scope = ["r_liteprofile","r_emailaddress","w_member_social"]

router.get('/authorize', (req, res) => {
 	res.redirect(authServer.authorizationEndpoint+'?response_type=code&client_id='+client.client_id+'&redirect_uri='+client.redirect_uris+'&state=fooobar&scope='+scope)
})

router.get('/callback', (req, res) => {

	let code = req.query.code
	console.log("OAuth token "+code)
	let form_data = qs.stringify({
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: client.redirect_uris[0],
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
	res.redirect('/')
})

router.get('/LinkedInProfile', (req,res) => {
  let headers = {
		'Authorization': 'Bearer '+access_token,
  }
  let resource = request('GET', 'https://api.linkedin.com/v2/me', {
		headers: headers
  })
  console.log(resource.statusCode)
  if(resource.statusCode >= 200 && resource.statusCode < 300){
    let body = JSON.parse(resource.getBody())
    console.log(body)
	res.status(resource.statusCode).json(body)
	}
	else {
	console.log("error: Server returned response code: "`${resource.statusCode}`)
	res.status(resource.statusCode).send("error: Server returned response code: "`${resource.statusCode}`)
	}
})

router.get('/ProfilePicture', (req,res) => {
	let headers = {
		  'Authorization': 'Bearer '+access_token,
	}
	let resource = request('GET', 'https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', {
		  headers: headers
	})
	if(resource.statusCode >= 200 && resource.statusCode < 300){
		let body = JSON.parse(resource.getBody())
		res.status(resource.statusCode).json(body)
		//res.status(resource.statusCode).json(body['profilePicture']['displayImage~']['elements'][3]['identifiers'][0]['identifier'])
	}
	else {
		console.log("error: Server returned response code: "`${resource.statusCode}`)
		res.status(resource.statusCode).send("error: Server returned response code: "`${resource.statusCode}`)
	}
})
   
module.exports = router