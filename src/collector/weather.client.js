const axios = require('axios');

// const HEFENG_BASE_URL = 'https://ke564uq49g.re.qweatherapi.com/v7';
const HEFENG_BASE_URL = 'https://ke564uq49g.re.qweatherapi.com/v7/weather/now';

/**
 * 获取实时天气
 * @param {string} location 城市 code，例如 101010100（北京）
 */
async function fetchCurrentWeather(location) {
  const res = await axios.get(HEFENG_BASE_URL, {
    params: {
      key: process.env.HEFENG_KEY,
      location
    }
  });

  return res.data;
}

module.exports = {
  fetchCurrentWeather
};
