const axios = require('axios');

/**
 * 和风天气服务
 */
class WeatherService {
  constructor() {
    this.apiKey = process.env.QWEATHER_KEY;
    // 从环境变量读取 API Host，支持免费版(devapi)和商业版(api)切换
    this.baseUrl = process.env.QWEATHER_API_HOST || 'https://devapi.qweather.com/v7';
  }

  /**
   * 获取实时天气
   * @param {string} location - 城市 locationId（和风天气的城市代码）
   * @returns {Promise<Object>} 标准化的天气数据
   */
  async fetchRealtimeWeather(location) {
    try {
      const url = `${this.baseUrl}/weather/now`;
      
      // 调试日志：输出实际请求的 URL 和 Key
      console.log(`请求和风天气 API: ${url}?location=${location}&key=${this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'undefined'}`);
      
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
        observeTime: new Date(now.obsTime), // 观测时间(转为 Date 对象供 MySQL 使用)
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
      // 增强错误信息，输出详细的响应内容
      if (error.response) {
        console.error(`Failed to fetch weather for location ${location}:`, error.message);
        console.error('和风天气 API 响应:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(`Failed to fetch weather for location ${location}:`, error.message);
      }
      throw error;
    }
  }
}

module.exports = new WeatherService();
