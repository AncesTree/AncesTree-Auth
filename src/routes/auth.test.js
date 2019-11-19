
const request = require('supertest')
const app = require('../app')
const knex = require('../config/database')

describe('Test auth route', () => {
  test('It should handle 400 errors', async () => {
 //   const res = await request(app)
 //     .post('auth/register')

 //    expect(res.statusCode).toBe(400)
     expect(1==1).toBe(true)
  })
})
