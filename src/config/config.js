require('dotenv').config()

let CLIENT_URL
if (process.env.ENV === 'DEV') {
  CLIENT_URL = 'http://localhost:3000'
} else {
  CLIENT_URL = 'https://ancestree.igpolytech.fr'
}

module.exports = { CLIENT_URL }
