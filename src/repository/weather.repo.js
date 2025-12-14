const pool = require('../config/db');

/**
 * 用于健康检查
 */
async function testQuery() {
  const [rows] = await pool.query('SELECT NOW() AS now_time');
  return rows[0];
}

/**
 * 插入一条天气数据
 */
async function insertWeather(data) {
  const sql = `
    INSERT INTO weather_realtime (
      city_id,
      observe_time,
      temperature,
      humidity,
      weather_text
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    data.cityId,
    data.observeTime,
    data.temperature,
    data.humidity,
    data.weatherText
  ];

  return pool.execute(sql, params);
}

module.exports = {
  testQuery,
  insertWeather
};
