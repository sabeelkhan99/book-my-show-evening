const express = require('express');
const MailgunClient = require('../lib/MailGunClient');

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'Recived healthcheck' })
});

router.get('/echo', (req, res) => {
    res.json({ success: true, message: 'Echo Received' })
});

router.get('/test', async(req, res) => {
        await MailgunClient.sendEmail('sabeelsjs@gmail.com', 'Forgot Password', `
        Hi There!
        Please click on the link, to reset your password .
        Thanks
        BookMyShowTeam
        `)
    res.send('Mail sent successfully');
})

module.exports = router;