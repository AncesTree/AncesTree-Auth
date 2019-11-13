const knex = require("../database")

    const newUser = (req, res) => {
        console.log(req.query)
        const {email, password} = req.query
        return knex('users').insert({email: email, password: password})
        .returning('id')
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => res.status(400).json(err))
    }

    const getUser = (req, res) => {
        console.log(req.query)
        const {id} = req.query
        return knex('users').select().where({id: id})
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(400).json(err))
    }

    const getUserByEmail = (req, res) => {
        console.log(req.query)
        const {email} = req.query
        return knex('users').select().where({email: email})
        .then(user => {
            return new Promise((resolve, reject) => {
                resolve(user)
            })
        })
        .catch(err => res.status(400).json(err))
    }

    const updateUser = (req,res) => {
        console.log(req.query)
        const {id, email, password} = req.query
        return knex('users')
        .where({id: id})
        .update({email: email, password: password})
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(400).json(err))
    }

    const deleteUser = (req,res) => {
        console.log(req.query)
        const {id} = req.query
        return knex('users')
        .where({id: id})
        .del()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(400).json(err))
    }

module.exports = {newUser, getUser, getUserByEmail, deleteUser, updateUser}