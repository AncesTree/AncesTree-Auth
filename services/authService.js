const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const randomSecretKey = uuidv4();

const checkPassword = (plainPassword,password) => {
    return plainPassword == password
    //return bcrypt.compareSync(plainPassword, password)
}

const hashPassword = (plainPassword) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
}

const checkToken = (req, res) => {
    console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, randomSecretKey);
    if (!payload){
        res.status(401).send('Unauthorized request')
    }
    console.log(payload)
    res.status(200).send(payload.id)
}

module.exports = {checkPassword, checkToken, hashPassword, jwt, randomSecretKey}