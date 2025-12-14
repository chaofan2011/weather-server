const { insertWeather } = require('../repository/weather.repo');
const { fetchAndSaveWeather } = require('../service/weather.service');

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

async function fetchWeather(req, res) {
  const result = await fetchAndSaveWeather();
  res.json({
    message: 'weather fetched',
    data: result
  });
}

module.exports = {
  mockInsert,
  fetchWeather
};
