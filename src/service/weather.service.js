const axios = require('axios');

/**
 * 和风天气服务
 */
class WeatherService {
  constructor() {
    this.apiKey = process.env.QWEATHER_KEY;
    this.baseUrl = 'https://devapi.qweather.com/v7'; // 免费版用 devapi，商业版用 api
  }

  /**
   * 获取实时天气
   * @param {string} location - 城市 locationId（和风天气的城市代码）
   * @returns {Promise<Object>} 标准化的天气数据
   */
  async fetchRealtimeWeather(location) {
    try {
      const url = `${this.baseUrl}/weather/now`;
      const response = await axios.get(url, {
        params: {
          location,
          key: this.apiKey
        },
        timeout: 10000
      });

      const { code, now } = response.data;

      // 和风天气响应码：200 表示成功
      if (code !== '200') {
        throw new Error(`QWeather API error: code=${code}`);
      }

      // 将和风天气的字段映射到我们的数据结构
      return {
        observeTime: now.obsTime,           // 观测时间（ISO 8601）
        temperature: parseFloat(now.temp),  // 温度
        feelsLike: parseFloat(now.feelsLike), // 体感温度
        humidity: parseInt(now.humidity),   // 相对湿度
        pressure: parseInt(now.pressure),   // 大气压强
        windSpeed: parseFloat(now.windSpeed), // 风速
        windDir: now.windDir,               // 风向
        precipitation: parseFloat(now.precip || 0), // 降水量
        weatherText: now.text,              // 天气状况文字描述
        weatherCode: now.icon               // 天气图标代码
      };
    } catch (error) {
      console.error(`Failed to fetch weather for location ${location}:`, error.message);
      throw error;
    }
  }
}

module.exports = new WeatherService();
