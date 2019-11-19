const request = require('supertest')
const app = require('../app')
const knex = require('../config/database')

describe('Test users route', () => {
  test('It should handle 404 errors', async () => {
    const res = await request(app)
      .get('/users')

    expect(res.statusCode).toBe(404)
  })
})
