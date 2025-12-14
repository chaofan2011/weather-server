const express = require('express');
const { mockInsert, triggerCollect, getCities, getLatest, getRecent } = require('./api/weather.controller');

const router = express.Router();

// ========== 写入/采集接口 ==========
router.post('/weather/mock', mockInsert);
router.post('/weather/collect', triggerCollect); // 手动触发采集

// ========== 查询接口 ==========
router.get('/cities', getCities);                // 查询城市列表（下拉选择）
router.get('/weather/latest', getLatest);        // 查询某城市最新一条天气
router.get('/weather/recent', getRecent);        // 查询某城市最近 N 条（折线图）

module.exports = router;
