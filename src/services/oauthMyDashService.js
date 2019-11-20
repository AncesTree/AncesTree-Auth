const request = require("sync-request")
const linkedInUser = require("../models/linkedInUsers")
const myDashUser = require("../models/myDashUsers")
const invitation = require("../models/invitation")
const invitedUsers = require("../models/invitedUsers")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require("../services/authService")

const isRegistered = (myDashName) => {
    return myDashUser.getUserByName(myDashName).then((res) => {
        if(res){
            return true
        }
        else{
            return false
        }
    })
}

const createAccount = (name) => {
    return myDashUser.newUser(name)
}

module.exports = {isRegistered, createAccount}