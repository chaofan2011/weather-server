const cron = require('node-cron');
const weatherService = require('../service/weather.service');
const { getCityList, insertWeather } = require('../repository/weather.repo');

/**
 * 采集所有城市的实时天气数据
 */
async function collectWeatherData() {
  console.log(`[${new Date().toISOString()}] 开始采集天气数据...`);

  try {
    // 1. 获取所有城市列表
    const cities = await getCityList();
    
    if (cities.length === 0) {
      console.warn('城市列表为空，跳过本次采集');
      return;
    }

    console.log(`共需采集 ${cities.length} 个城市的天气数据`);

    // 2. 逐个城市拉取天气并插入数据库
    let successCount = 0;
    let failCount = 0;

    for (const city of cities) {
      try {
        // 调用和风天气 API
        const weatherData = await weatherService.fetchRealtimeWeather(city.city_code);

        // 组装数据库记录
        const record = {
          cityId: city.id,
          observeTime: weatherData.observeTime,
          temperature: weatherData.temperature,
          feelsLike: weatherData.feelsLike,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          windSpeed: weatherData.windSpeed,
          windDir: weatherData.windDir,
          precipitation: weatherData.precipitation,
          weatherText: weatherData.weatherText,
          weatherCode: weatherData.weatherCode,
          source: 'qweather'
        };

        // 插入数据库
        await insertWeather(record);
        
        successCount++;
        console.log(`✓ ${city.city_name} (${city.city_code}): ${weatherData.temperature}℃ ${weatherData.weatherText}`);
      } catch (error) {
        failCount++;
        console.error(`✗ ${city.city_name} (${city.city_code}) 采集失败:`, error.message);
      }

      // 避免频繁请求，每个城市之间延迟 100ms
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`采集完成: 成功 ${successCount}，失败 ${failCount}`);
  } catch (error) {
    console.error('天气数据采集异常:', error);
  }
}

/**
 * 启动定时任务
 */
function startWeatherJob() {
  // 每 10 分钟执行一次（和风天气免费版限流，建议不低于 10 分钟）
  // cron 表达式: '*/10 * * * *' 表示每 10 分钟
  // 你可以根据需要调整，例如：
  // - '0 * * * *'  每小时整点
  // - '*/30 * * * *' 每 30 分钟
  // - '0 6-22 * * *' 每天 6:00 到 22:00 之间每小时整点
  
  const schedule = '*/10 * * * *'; // 每 10 分钟

  cron.schedule(schedule, collectWeatherData, {
    timezone: 'Asia/Shanghai'
  });

  console.log(`天气采集定时任务已启动，调度规则: ${schedule}`);

  // 启动后立即执行一次（可选，如果不想立即执行就注释掉下面这行）
  collectWeatherData();
}

module.exports = {
  startWeatherJob,
  collectWeatherData // 导出供手动调用
};
