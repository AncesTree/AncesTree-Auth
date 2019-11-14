const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const randomSecretKey = uuidv4();

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

module.exports = {checkPassword, checkToken, hashPassword, jwt, randomSecretKey}