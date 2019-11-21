const knex = require("../config/database")

    const newUser = (id, email) => {
        console.log(email+'  '+id)
        return new Promise((resolve, reject) => {
            knex('linkedin_users').insert({email: email, id: id})
            .returning('*')
            .then(user => resolve(user))
            .catch(err =>{ 
                console.log(err)
                reject(err)})
        })
    }

    const getUser = (id) => {
        return new Promise((resolve, reject) => {
            knex('users')
            .select()
            .where({id: id})
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const getUserByEmail = (email) => {
        return new Promise((resolve, reject) => {
            knex('linkedin_users')
            .select()
            .where({email: email})
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const updateUser = (id, email, password) => {
        return new Promise((resolve, reject) => {
            knex('users')
            .where({id: id})
            .update({email: email, password: password})
            .returning("*")
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

    const deleteUser = (id) => {
        return new Promise((resolve, reject) => {
            knex('users')
            .where({id: id})
            .del()
            .then(user => resolve(user[0]))
            .catch(err => reject(err))
        })
    }

module.exports = {newUser, getUser, getUserByEmail, deleteUser, updateUser}