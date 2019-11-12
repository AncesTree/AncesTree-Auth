const nodemailer = require('nodemailer');


async function getTransporter(){
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    return transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });
}


async function sendInvitation(email, firstname, lastname){
    let transporter = await getTransporter()
    let sentEmail = await transporter.sendMail({
        from: '"Ancestree" <ancestree@email.com>', // sender address
        to: email, // list of receivers
        subject: 'Rejoignez Ancestree! Le reseau social des anciens IG', // Subject line
        text: `Bonjour ${firstname} ${lastname}\nRejoignez Ancestree le reseau social des anciens IG en cliquant ici`, // plain text body
    });
    console.log('Message sent: %s', sentEmail.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(sentEmail));
    return nodemailer.getTestMessageUrl(sentEmail)
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {sendInvitation}