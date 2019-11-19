const request = require('supertest')
const app = require('./app')

describe('Test well known routes', () => {
  test('The homepage should be available', async () => {
    const res = await request(app)
      .get('/')

    expect(res.statusCode).toBe(200)
    expect(res.body).not.toBeFalsy()
  })

  test('It should handle 404 errors', async () => {
    const res = await request(app)
      .get('/route/that/doesnt/exists')

    expect(res.statusCode).toBe(404)
  })
})
