const express = require("express")
var router = express.Router();

const email = require("../email")

router.get('/sendInvitation', async (req, res) => {
    console.log(req.query)
    let sentEmail = await email.sendInvitation(req.query.email,req.query.firstname,req.query.lastname)
    res.redirect(sentEmail)
})

module.exports = router