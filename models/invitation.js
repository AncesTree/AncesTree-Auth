const knex = require("../config/database")

    const newInvitation = (id) => {
        return new Promise((resolve, reject) => { 
            knex('invitations').insert({id: id})
            .returning('id')
            .then(user => resolve(user))
            .catch(err => reject(err))
        })
    }

    const getInvitation = (id) => {
        return new Promise((resolve, reject) => { 
            knex('invitations').select().where({id: id})
            .then(user => resolve(user))
            .catch(err => reject(err))
        })
    }

    const deleteInvitation = (id) => {
        return new Promise((resolve, reject) => { 
            knex('invitations').where({id: id}).del()
            .then(invit => resolve(invit))
            .catch(err => reject(err))
        })
    }

module.exports = {newInvitation, getInvitation, deleteInvitation}