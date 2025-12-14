const { insertWeather } = require('../repository/weather.repo');
const { collectWeatherData } = require('../job/weather.job');

async function mockInsert(req, res) {
  await insertWeather({
    cityId: 1,
    observeTime: new Date(),
    temperature: 23.4,
    humidity: 58,
    weatherText: '晴'
  });

  res.json({ message: 'weather inserted' });
}

/**
 * 手动触发天气采集（供测试使用）
 */
async function triggerCollect(req, res) {
  // 异步执行，不阻塞响应
  collectWeatherData();
  
  res.json({ 
    message: '天气采集任务已触发，请查看控制台日志' 
  });
}

module.exports = {
  mockInsert,
  triggerCollect
};
