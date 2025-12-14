const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // 连接超时配置（针对公网远程 MySQL，适当放宽）
  connectTimeout: 20000,      // 连接 MySQL 服务器的超时时间（20秒）
  acquireTimeout: 20000,      // 从连接池获取连接的等待超时（20秒）
  
  // 保持连接活跃，防止长时间空闲被云数据库/防火墙断开
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

module.exports = pool;
