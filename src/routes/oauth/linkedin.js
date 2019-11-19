const request = require('sync-request')
const qs = require('qs')
const linkedInService = require('../../services/oauthLinkedInService')
const config = require('../../config/config')
require('dotenv').config()

const authServer = {
  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken'
}
const client = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uris_login: [process.env.REDIRECT_URI_LOGIN],
  redirect_uris_registration: [process.env.REDIRECT_URI_REGISTRATION]
}
let access_token; const scope = ['r_liteprofile', 'r_emailaddress', 'w_member_social']

exports.register = async (req, res) => {
 	return res.redirect(authServer.authorizationEndpoint + '?response_type=code&client_id=' + client.client_id + '&redirect_uri=' + client.redirect_uris_registration + '&state=fooobar&scope=' + scope)
}

exports.registration_callback = (req, res) => {
  console.log(req.query.id)
  const code = req.query.code
  const form_data = qs.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: client.redirect_uris_registration[0],
    client_id: client.client_id,
    client_secret: client.client_secret
  })
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const response = request('POST', authServer.tokenEndpoint, {
    headers: headers,
    body: form_data
  })
  const body = JSON.parse(response.getBody())

  access_token = body.access_token

  const account_email = linkedInService.getEmail(access_token)
  const profile_picture = linkedInService.getProfilePicture(access_token)

  linkedInService.completeInvitation(account_email, req.query.id, profile_picture)
    .then((result) => {
      return res.redirect(config.CLIENT_URL + '/token/' + result.token).end()
    })
    .catch((err) => {
      return res.status(err.status).send(err.error).end()
    })
}

exports.linkedinprofile = (req, res) => {
  const headers = {
    Authorization: 'Bearer ' + access_token
  }
  const resource = request('GET', 'https://api.linkedin.com/v2/me', {
    headers: headers
  })
  console.log(resource.statusCode)
  if (resource.statusCode >= 200 && resource.statusCode < 300) {
    const body = JSON.parse(resource.getBody())
    console.log(body)
    return res.status(resource.statusCode).json(body)
  } else {
    console.log('error: Server returned response code: '`${resource.statusCode}`)
    return res.status(resource.statusCode).send('error: Server returned response code: '`${resource.statusCode}`)
  }
}
