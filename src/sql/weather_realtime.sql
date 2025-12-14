/*
 Navicat Premium Dump SQL

 Source Server         : 阿里云
 Source Server Type    : MySQL
 Source Server Version : 80407 (8.4.7)
 Source Host           : 123.57.172.165:3306
 Source Schema         : weather_app

 Target Server Type    : MySQL
 Target Server Version : 80407 (8.4.7)
 File Encoding         : 65001

 Date: 14/12/2025 12:56:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for weather_realtime
-- ----------------------------
DROP TABLE IF EXISTS `weather_realtime`;
CREATE TABLE `weather_realtime` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `city_id` bigint unsigned NOT NULL COMMENT '城市ID',
  `observe_time` datetime NOT NULL COMMENT '观测时间',
  `temperature` decimal(5,2) NOT NULL COMMENT '气温 ℃',
  `feels_like` decimal(5,2) DEFAULT NULL COMMENT '体感温度 ℃',
  `humidity` tinyint unsigned DEFAULT NULL COMMENT '湿度 %',
  `pressure` smallint unsigned DEFAULT NULL COMMENT '气压 hPa',
  `wind_speed` decimal(5,2) DEFAULT NULL COMMENT '风速 m/s',
  `wind_dir` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '风向',
  `precipitation` decimal(5,2) DEFAULT NULL COMMENT '降水量 mm',
  `weather_text` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '天气描述',
  `weather_code` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '天气代码',
  `source` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'qweather' COMMENT '数据来源',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_city_time` (`city_id`,`observe_time`),
  KEY `idx_city_time` (`city_id`,`observe_time`),
  KEY `idx_time` (`observe_time`),
  CONSTRAINT `fk_weather_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实时天气数据';

SET FOREIGN_KEY_CHECKS = 1;
