require('dotenv').config();
const express = require('express');

const { testQuery } = require('./repository/weather.repo');
const router = require('./router');
const { startWeatherJob } = require('./job/weather.job');

const app = express();

app.use(express.json());

/**
 * 健康检查（非常重要，别删）
 */
app.get('/health', async (req, res) => {
  const dbTime = await testQuery();
  res.json({
    status: 'ok',
    dbTime
  });
});

/**
 * 业务 API修改
 */
app.use('/api', router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
  
  // 启动天气采集定时任务
  startWeatherJob();
});
