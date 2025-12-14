const { insertWeather, getCityList, getLatestWeather, getRecentWeather } = require('../repository/weather.repo');
const { collectWeatherData } = require('../job/weather.job');

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

/**
 * 手动触发天气采集（供测试使用）
 */
async function triggerCollect(req, res) {
  // 异步执行，不阻塞响应
  collectWeatherData();
  
  res.json({ 
    message: '天气采集任务已触发，请查看控制台日志' 
  });
}

/**
 * 查询支持的城市列表（供前端下拉选择）
 */
async function getCities(req, res) {
  try {
    const cities = await getCityList();
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('查询城市列表失败:', error);
    res.status(500).json({
      success: false,
      message: '查询城市列表失败'
    });
  }
}

/**
 * 查询某城市最新一条天气数据
 */
async function getLatest(req, res) {
  try {
    const cityId = parseInt(req.query.cityId || req.params.cityId);
    
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: '缺少参数 cityId'
      });
    }

    const weather = await getLatestWeather(cityId);
    
    if (!weather) {
      return res.status(404).json({
        success: false,
        message: '未找到该城市的天气数据'
      });
    }

    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('查询最新天气失败:', error);
    res.status(500).json({
      success: false,
      message: '查询最新天气失败'
    });
  }
}

/**
 * 查询某城市最近 N 条天气数据（用于折线图）
 */
async function getRecent(req, res) {
  try {
    const cityId = parseInt(req.query.cityId || req.params.cityId);
    const limit = parseInt(req.query.limit) || 24; // 默认返回 24 条
    
    if (!cityId) {
      return res.status(400).json({
        success: false,
        message: '缺少参数 cityId'
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'limit 参数范围应为 1-100'
      });
    }

    const weatherList = await getRecentWeather(cityId, limit);
    
    res.json({
      success: true,
      data: weatherList,
      count: weatherList.length
    });
  } catch (error) {
    console.error('查询历史天气失败:', error);
    res.status(500).json({
      success: false,
      message: '查询历史天气失败'
    });
  }
}

module.exports = {
  mockInsert,
  triggerCollect,
  getCities,
  getLatest,
  getRecent
};
