const express = require('express');
const { mockInsert, triggerCollect } = require('./api/weather.controller');

const router = express.Router();

router.post('/weather/mock', mockInsert);
router.post('/weather/collect', triggerCollect); // 手动触发采集

module.exports = router;
