const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const randomSecretKey = uuidv4();
const invitation = require("../models/invitation")
const users = require("../models/users")
const invitedUsers = require("../models/invitedUsers")


const checkPassword = (plainPassword,password) => {
    return bcrypt.compareSync(plainPassword, password)
}

const hashPassword = (plainPassword) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
}

const checkToken = (req) => {
    return new Promise((resolve, reject) =>{
        if (!req.headers.authorization) {
            reject('Unauthorized')
        }
        let token = req.headers.authorization;
        if (token === 'null') {
            reject('Unauthorized')
        }
        let payload = jwt.verify(token, randomSecretKey);
        if (!payload){
            reject('Unauthorized')
        }
        resolve(payload)
    })
}

const completeInvitation = (req) => {
    console.log(req.body)
    return new Promise((resolve, reject) => {
        invitation.getInvitation(req.body.id).then((id) => {
            if(id.length == 1){
                users.newUser(req.body.id, req.body.email, hashPassword(req.body.password))
                .then(() => {
                    let deleteInvitationPromise = invitation.deleteInvitation(req.body.id)
                    let deleteInvitedUserPromise = invitedUsers.deleteUser(req.body.id)
                     Promise.all([deleteInvitationPromise, deleteInvitedUserPromise])
                    .then((result) => {
                        let user = result[0]
                        token = jwt.sign({id: user.id}, randomSecretKey, {expiresIn: '4h'});
                        resolve({token: token})
                    })
                    .catch(error => reject({error: error, status: 400}))
                })
                .catch(error => reject({error: error, status: 409}))
            }
            else{
                reject({error: "Invitation not found!", status: 404})
            }
        })
        .catch(error => reject({error: error, status: 400}))
    })
}

module.exports = {checkPassword, checkToken, completeInvitation, hashPassword, jwt, randomSecretKey}