const { insertWeather } = require('../repository/weather.repo');

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

module.exports = {
  mockInsert
};
