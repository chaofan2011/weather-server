const pool = require('../config/db');

/**
 * 带重试的安全查询封装
 * 用于处理偶发的 ETIMEDOUT / 连接丢失等错误
 */
async function queryWithRetry(sql, params = [], retries = 2) {
  try {
    return await pool.query(sql, params);
  } catch (err) {
    // 只对"连接类"错误做重试
    const transientErrors = ['ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST', 'ECONNRESET'];

    if (retries > 0 && transientErrors.includes(err.code)) {
      const attemptNum = 3 - retries; // 计算当前是第几次尝试
      console.warn(
        `DB query failed with ${err.code} (attempt ${attemptNum}/3), retrying in 1s... sql=${sql
          .trim()
          .slice(0, 60)}...`
      );
      // 等待 1 秒后重试，给云数据库更多恢复时间
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return queryWithRetry(sql, params, retries - 1);
    }

    // 非瞬时错误或重试用完，正常抛出
    console.error(`DB query failed after all retries: ${err.code}`);
    throw err;
  }
}

/**
 * 用于健康检查
 */
async function testQuery() {
  const [rows] = await queryWithRetry('SELECT NOW() AS now_time');
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
  const [rows] = await queryWithRetry(sql);
  return rows;
}

/**
 * 查询某城市最新一条天气数据
 * @param {number} cityId - 城市 ID
 */
async function getLatestWeather(cityId) {
  const sql = `
    SELECT 
      w.id,
      w.city_id,
      c.city_name,
      c.city_code,
      w.observe_time,
      w.temperature,
      w.feels_like,
      w.humidity,
      w.pressure,
      w.wind_speed,
      w.wind_dir,
      w.precipitation,
      w.weather_text,
      w.weather_code,
      w.source,
      w.created_at
    FROM weather_realtime w
    LEFT JOIN city c ON w.city_id = c.id
    WHERE w.city_id = ?
    ORDER BY w.observe_time DESC
    LIMIT 1
  `;
  const [rows] = await queryWithRetry(sql, [cityId]);
  return rows[0] || null;
}

/**
 * 查询某城市最近 N 条天气数据（用于折线图）
 * @param {number} cityId - 城市 ID
 * @param {number} limit - 返回条数，默认 24
 */
async function getRecentWeather(cityId, limit = 24) {
  const sql = `
    SELECT 
      w.id,
      w.city_id,
      c.city_name,
      w.observe_time,
      w.temperature,
      w.feels_like,
      w.humidity,
      w.pressure,
      w.wind_speed,
      w.wind_dir,
      w.precipitation,
      w.weather_text,
      w.weather_code
    FROM weather_realtime w
    LEFT JOIN city c ON w.city_id = c.id
    WHERE w.city_id = ?
    ORDER BY w.observe_time DESC
    LIMIT ?
  `;
  const [rows] = await queryWithRetry(sql, [cityId, limit]);
  // 返回时按时间正序（方便前端绘制折线图）
  return rows.reverse();
}

module.exports = {
  testQuery,
  insertWeather,
  getCityList,
  getLatestWeather,
  getRecentWeather
};
