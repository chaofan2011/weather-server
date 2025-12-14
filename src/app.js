require('dotenv').config();
const express = require('express');

const { testQuery } = require('./repository/weather.repo');
const router = require('./router');

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
 * 业务 API
 */
app.use('/api', router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
