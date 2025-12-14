const { fetchCurrentWeather } = require('../collector/weather.client');
const { insertWeather } = require('../repository/weather.repo');

/**
 * 抓取并保存实时天气
 */
async function fetchAndSaveWeather() {
  // 先写死一个城市（北京）
  const location = '101010100';

  const data = await fetchCurrentWeather(location);

  const now = data.now;
const observeTime = new Date(now.obsTime);

// 转成 MySQL DATETIME
const formattedTime = observeTime
  .toISOString()
  .slice(0, 19)
  .replace('T', ' ');
  const weatherRecord = {
    cityId: location,
    observeTime: formattedTime,
    temperature: Number(now.temp),
    humidity: Number(now.humidity),
    weatherText: now.text
  };

  await insertWeather(weatherRecord);

  return weatherRecord;
}

module.exports = {
  fetchAndSaveWeather
};
