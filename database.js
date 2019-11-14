require('dotenv').config()


let knex 
if(process.env.ENV == 'DEV'){
  knex = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.HOST,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE
    }
  });
}
else{
  knex = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL
  }); 
}

module.exports = knex

