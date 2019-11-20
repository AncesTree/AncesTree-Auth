const knex = require("../config/database")


const newUser = (email) => {
    console.log(email)
    return new Promise((resolve, reject) => {
        knex('invited_users').insert({email: email})
        .returning('*')
        .then(user => resolve(user[0]))
        .catch(err => reject(err))
    })
}

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        knex('invited_users')
        .select()
        .where({id: id})
        .then(user => resolve(user[0]))
        .catch(err => reject(err))
    })
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        knex('invited_users')
        .where({id: id})
        .del()
        .then(user => resolve(user[0]))
        .catch(err => reject(err))
    })
}

module.exports = {newUser, getUser, deleteUser}