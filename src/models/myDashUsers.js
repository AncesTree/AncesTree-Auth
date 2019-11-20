const knex = require("../config/database")

    const newUser = (name) => {
        return new Promise((resolve, reject) => {
            knex('mydash_users').insert({name: name})
            .returning('*')
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const getUser = (id) => {
        return new Promise((resolve, reject) => {
            knex('mydash_users')
            .select()
            .where({id: id})
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const getUserByName = (name) => {
        return new Promise((resolve, reject) => {
            knex('mydash_users')
            .select()
            .where({name: name})
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const updateUser = (id, email, password) => {
        return new Promise((resolve, reject) => {
            knex('mydash_users')
            .where({id: id})
            .update({email: email, password: password})
            .returning("*")
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const deleteUser = (id) => {
        return new Promise((resolve, reject) => {
            knex('mydash_users')
            .where({id: id})
            .del()
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

module.exports = {newUser, getUser, getUserByName, deleteUser, updateUser}