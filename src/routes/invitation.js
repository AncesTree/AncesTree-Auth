const express = require('express')
const router = express.Router()
const request = require('sync-request')
const qs = require('qs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const emailService = require('../services/emailService')
const authService = require('../services/authService')
const invitation = require('../models/invitation')
const users = require('../models/users')
const invitedUsers = require('../models/invitedUsers')

const INVALID_REQUEST = 'invalid_request'

exports.invitation = async (req, res) => {
  if (!req.body.email || !req.body.firstname || !req.body.lastname) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'email, firstname or lastname was missing from the string query'
    })
  }
  invitedUsers.newUser(req.body.email).then(user => {
    const emailPromise = emailService.sendInvitation(req.body.email, req.body.firstname, req.body.lastname, user.id)

    const token = jwt.sign({ id: user.id }, authService.randomSecretKey, { expiresIn: '4h' })
    const options = { headers: { Authorization: token, 'Content-Type': 'application/json' } }

    const graphPromise = axios.post('https://ancestree-api-neo4j.igpolytech.fr/api/users', {
      id: user.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      birthdate: req.body.birthdate,
      phone: req.body.phone
    }, options)
    const saveInvitationPromise = invitation.newInvitation(user.id)

    Promise.all([graphPromise, saveInvitationPromise])
      .then((result) => {
        emailPromise.then(() => res.status(201).send(result[1]))
      }).catch((error) => {
        invitedUsers.deleteUser(user.id).then(() => { res.status(400).send(error) })
      })
  })
    .catch(error => res.status(400).send(error))
}

exports.check = async (req, res) => {
  invitation.getInvitation(req.body.id)
    .then((id) => {
      if (id.length == 1) {
        res.status(200).send()
      } else {
        res.status(404).send()
      }
    })
    .catch((error) => res.status(400).send(error))
}

exports.basic = async (req, res) => {
  authService.completeInvitation(req)
    .then((token) => res.status(201).send(token))
    .catch((err) => {
      res.status(err.status).send(err.error)
    })
}
