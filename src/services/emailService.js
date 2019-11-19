const nodemailer = require('nodemailer')
require('dotenv').config()

async function getTransporter () {
  const testAccount = await nodemailer.createTestAccount()
  // create reusable transporter object using the default SMTP transport
  if (process.env.ENV === 'DEV') {
    return transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    })
  } else {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    })
  }
}

async function sendInvitation (email, firstname, lastname, id) {
  const transporter = await getTransporter()
  const sentEmail = await transporter.sendMail({
    from: '"Ancestree" <noreply@ancestree.com>', // sender address
    to: email, // list of receivers
    subject: 'Rejoignez Ancestree! Le reseau social des anciens IG', // Subject line
    text: `Bonjour ${firstname} ${lastname}\nVous avez été invité à rejoindre Ancestree, le reseau social des anciens IG en cliquant sur le lien suivant https://ancestree.igpolytech.fr/join/${id}` // plain text body
  })
  console.log('Message sent: %s', sentEmail.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(sentEmail))
  return nodemailer.getTestMessageUrl(sentEmail)
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { sendInvitation }
