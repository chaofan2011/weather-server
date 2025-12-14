const express = require('express');
const { mockInsert } = require('./api/weather.controller');

const router = express.Router();

router.post('/weather/mock', mockInsert);

module.exports = router;
