const express = require('express');
const { mockInsert } = require('./api/weather.controller');
const { fetchWeather } = require('./api/weather.controller');

const router = express.Router();

router.post('/weather/mock', mockInsert);
router.post('/weather/fetch', fetchWeather);

module.exports = router;
