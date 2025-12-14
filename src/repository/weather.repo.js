const pool = require('../config/db');

/**
 * 用于健康检查
 */
async function testQuery() {
  const [rows] = await pool.query('SELECT NOW() AS now_time');
  return rows[0];
}

/**
 * 插入一条天气数据（完整字段版本）
 */
async function insertWeather(data) {
  const sql = `
    INSERT INTO weather_realtime (
      city_id,
      observe_time,
      temperature,
      feels_like,
      humidity,
      pressure,
      wind_speed,
      wind_dir,
      precipitation,
      weather_text,
      weather_code,
      source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      temperature = VALUES(temperature),
      feels_like = VALUES(feels_like),
      humidity = VALUES(humidity),
      pressure = VALUES(pressure),
      wind_speed = VALUES(wind_speed),
      wind_dir = VALUES(wind_dir),
      precipitation = VALUES(precipitation),
      weather_text = VALUES(weather_text),
      weather_code = VALUES(weather_code),
      source = VALUES(source)
  `;

  const params = [
    data.cityId,
    data.observeTime,
    data.temperature,
    data.feelsLike || null,
    data.humidity || null,
    data.pressure || null,
    data.windSpeed || null,
    data.windDir || null,
    data.precipitation || null,
    data.weatherText || null,
    data.weatherCode || null,
    data.source || 'qweather'
  ];

  return pool.execute(sql, params);
}

/**
 * 获取所有启用的城市列表
 */
async function getCityList() {
  const sql = 'SELECT id, city_code, city_name FROM city';
  const [rows] = await pool.query(sql);
  return rows;
}

module.exports = {
  testQuery,
  insertWeather,
  getCityList
};
