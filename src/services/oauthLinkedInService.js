const request = require("sync-request")
const linkedInUser = require("../models/linkedInUsers")
const invitation = require("../models/invitation")
const invitedUsers = require("../models/invitedUsers")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require("../services/authService")


const completeInvitation = (email, invitationId, profilePicture) => {
    console.log(invitationId, email)
    return new Promise((resolve, reject) => {
        invitation.getInvitation(invitationId).then((invit) => {
            if(invit.length == 1){
				let id = invit[0].id
                linkedInUser.newUser(id, email)
                .then((user) => {
					let token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
					const options = {headers: {Authorization: token, 'Content-Type': 'application/json'}}
					console.log(user)
					console.log('request started')
					let profilePicturePromise = axios.post('https://ancestree-api-neo4j.igpolytech.fr/api/users/picture/'+invitationId,{
						url: profilePicture
					}, options)
                    let deleteInvitationPromise = invitation.deleteInvitation(id)
					let deleteInvitedUserPromise = invitedUsers.deleteUser(id)
					profilePicturePromise.then((res) => console.log(res)).catch((error) => console.log(error))
                    Promise.all([deleteInvitationPromise, deleteInvitedUserPromise])
                    .then((result) => {
                        token = jwt.sign({id: id}, authService.randomSecretKey, {expiresIn: '4h'});
                        resolve({token: token})
                    })
                    .catch(error => reject({error: error, status: 400}))
                })
                .catch(err => reject({error: err, status: 409}))
            }
            else{
                reject({error: "Invitation not found!", status: 404})
            }
        })
        .catch(error => reject({error: error, status: 400}))
    })
}

const getEmail = (access_token) => {
	let headers = {
	    'Authorization': 'Bearer '+access_token,
	}
	let resource = request('GET', 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
		headers: headers
	})
	if(resource.statusCode >= 200 && resource.statusCode < 300){
	    let body = JSON.parse(resource.getBody())
	    return body['elements'][0]['handle~']['emailAddress']
	}
	else {
	    console.log("error: Server returned response code: "`${resource.statusCode}`)
	}
}

const getProfilePicture = (access_token) => {
	let headers = {
		  'Authorization': 'Bearer '+access_token,
	}
	let resource = request('GET', 'https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', {
		  headers: headers
	})
	if(resource.statusCode >= 200 && resource.statusCode < 300){
		let body = JSON.parse(resource.getBody())
		return body['profilePicture']['displayImage~']['elements'][3]['identifiers'][0]['identifier']
	}
	else {
		return null
	}
}

const handlelogin = (email) => {
	return new Promise((resolve, reject) => {
		linkedInUser.getUserByEmail(email).then((user) => {
			if (user.id.length > 0){
				let token = jwt.sign({id: user.id}, authService.randomSecretKey, {expiresIn: '4h'});
				resolve({token: token})
			}
			else{
				reject({error:'User not found', status:404})
			}
		}).catch((err) => reject({error:err, status:404}))
	})
}

module.exports = {getProfilePicture, getEmail, completeInvitation, handlelogin}
