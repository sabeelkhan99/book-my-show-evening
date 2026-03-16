const express = require('express');
const MailgunClient = require('../lib/MailGunClient');

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'Recived healthcheck' })
});

router.get('/echo', (req, res) => {
    res.json({ success: true, message: 'Echo Received' })
});

module.exports = router;