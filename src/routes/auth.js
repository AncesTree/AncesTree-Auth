const jwt = require('jsonwebtoken')
const users = require('../models/users')
const authService = require('../services/authService')

const INVALID_REQUEST = 'invalid request'

exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'email or password was missing from the string query'
    })
  }

  users.getUserByEmail(req.body.email).then(user => {
    if (user) {
      if (authService.checkPassword(req.body.password, user.password)) {
        const token = jwt.sign({ id: user.id }, authService.randomSecretKey, { expiresIn: '4h' })
        return res.status(200).send({ token: token })
      } else {
        return res.status(400).send('Invalid password')
      }
    } else {
      return res.status(400).send('User not found!')
    }
  })
}

exports.register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: INVALID_REQUEST,
      message: 'email or password was missing from the string query'
    })
  }

  users.newUser(req.body.email, authService.hashPassword(req.body.password))
    .then((user) => {
      const token = jwt.sign({ id: user.id }, authService.randomSecretKey, { expiresIn: '4h' })
      res.status(201).send({ token: token })
    })
    .catch(error => res.status(400).send(error))
}

exports.checktoken = async (req, res) => {
  authService.checkToken(req).then((payload) => res.status(200).send({ id: payload.id })).catch((error) => {
    res.status(403).send(error)
  })
}
