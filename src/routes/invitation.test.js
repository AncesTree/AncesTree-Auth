const request = require('supertest')
const app = require('../app')
const knex = require('../config/database')

describe('Test invitation route', () => {
  test('It should handle 400 errors', async () => {
    const res = await request(app)
      .post('/invitation')

    expect(res.statusCode).toBe(400)
  })
})
