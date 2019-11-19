const request = require('sync-request')
const linkedInUser = require('../models/linkedInUsers')
const invitation = require('../models/invitation')
const invitedUsers = require('../models/invitedUsers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authService = require('../services/authService')

const completeInvitation = (email, invitationId, profilePicture) => {
  console.log(invitationId, email)
  return new Promise((resolve, reject) => {
    invitation.getInvitation(invitationId).then((invit) => {
      if (invit.length == 1) {
        const id = invit[0].id
        linkedInUser.newUser(id, email)
          .then(() => {
            const deleteInvitationPromise = invitation.deleteInvitation(id)
            const deleteInvitedUserPromise = invitedUsers.deleteUser(id)
            Promise.all([deleteInvitationPromise, deleteInvitedUserPromise])
              .then((result) => {
                const user = result[0]
                token = jwt.sign({ id: id }, authService.randomSecretKey, { expiresIn: '4h' })
                resolve({ token: token })
              })
              .catch(error => reject({ error: error, status: 400 }))
          })
          .catch(error => reject({ error: error, status: 409 }))
      } else {
        reject({ error: 'Invitation not found!', status: 404 })
      }
    })
      .catch(error => reject({ error: error, status: 400 }))
  })
}

const getEmail = (access_token) => {
  const headers = {
	    Authorization: 'Bearer ' + access_token
  }
  const resource = request('GET', 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
    headers: headers
  })
  if (resource.statusCode >= 200 && resource.statusCode < 300) {
	    const body = JSON.parse(resource.getBody())
	    return body.elements[0]['handle~'].emailAddress
  } else {
	    console.log('error: Server returned response code: '`${resource.statusCode}`)
  }
}

const getProfilePicture = (access_token) => {
  const headers = {
		  Authorization: 'Bearer ' + access_token
  }
  const resource = request('GET', 'https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', {
		  headers: headers
  })
  if (resource.statusCode >= 200 && resource.statusCode < 300) {
    const body = JSON.parse(resource.getBody())
    return body.profilePicture['displayImage~'].elements[3].identifiers[0].identifier
  } else {
    return null
  }
}

module.exports = { getProfilePicture, getEmail, completeInvitation }
