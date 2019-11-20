require('dotenv').config()

const app = require('./app')
const port = 8080

app.listen(port, () => {
  console.log(`Auth server started on port ${port}`)
})