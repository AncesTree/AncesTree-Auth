const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');


const checkPassword = (plainPassword,password) => {
    return bcrypt.compareSync(plainPassword, password)
}

const hashPassword = (plainPassword) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
}

const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, process.env.SECRET_KEY);
    if (!payload){
        res.status(401).send('Unauthorized request')
    }
    res.status(200).send(payload.userId)
}

module.exports = {checkPassword, checkToken, hashPassword}