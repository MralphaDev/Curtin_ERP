-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3306
-- 生成日期： 2026-04-23 18:58:09
-- 服务器版本： 11.8.6-MariaDB-log
-- PHP 版本： 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `u550705974_erp_curin`
--

-- --------------------------------------------------------

--
-- 表的结构 `coil_independent`
--

CREATE TABLE `coil_independent` (
  `id` int(11) NOT NULL,
  `coil_idp_model` varchar(255) DEFAULT NULL,
  `voltage` varchar(50) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `unique_key_active` varchar(255) GENERATED ALWAYS AS (case when `deleted_at` is null then `coil_idp_model` else NULL end) STORED,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `coil_independent`
--

INSERT INTO `coil_independent` (`id`, `coil_idp_model`, `voltage`, `manufacturer`, `created_at`, `deleted_at`, `image_url`) VALUES
(1, 'IndependentCoil1', '24VAC', 'testcompany', '2026-04-19 12:15:33', NULL, NULL),
(2, 'testinpimg', '24VAC', 'GOETVALVE', '2026-04-23 11:18:10', NULL, 'https://gsvi.cc/images/solenoid.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `coil_standard`
--

CREATE TABLE `coil_standard` (
  `id` int(11) NOT NULL,
  `coil_model` varchar(255) DEFAULT NULL,
  `voltage` varchar(50) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `unique_key_active` varchar(255) GENERATED ALWAYS AS (case when `deleted_at` is null then `coil_model` else NULL end) STORED,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `coil_standard`
--

INSERT INTO `coil_standard` (`id`, `coil_model`, `voltage`, `manufacturer`, `created_at`, `deleted_at`, `image_url`) VALUES
(1, 'test1', '23VAC', 'testCompany', '2026-04-19 12:14:06', '2026-04-19 12:24:08', NULL),
(2, 'testbody', '24VAC', 'test', '2026-04-19 12:32:21', '2026-04-19 12:33:07', NULL),
(3, '6610VN4.0 AC110', '24VAC', 'JAKSA', '2026-04-20 08:31:33', '2026-04-20 08:53:14', NULL),
(4, '6610VN4.0 AC110', '24VAC', 'JAKSA', '2026-04-20 08:53:34', NULL, NULL),
(5, 'test1', '24VAC', 'JAKSA', '2026-04-20 08:56:22', '2026-04-20 08:56:31', NULL),
(6, 'testjaksa', '24VAC', 'JAKSA', '2026-04-21 09:45:24', '2026-04-23 11:56:27', NULL),
(7, 'testimg', '10VAC', 'GOETVALVE', '2026-04-23 11:05:50', '2026-04-23 11:08:27', NULL),
(8, 'testimg', '10VAC', 'CEME', '2026-04-23 11:08:33', '2026-04-23 11:10:52', NULL),
(9, 'testimg', '10VAC', 'GOETVALVE', '2026-04-23 11:11:10', NULL, 'https://gsvi.cc/images/pressureactuated.png');

-- --------------------------------------------------------

--
-- 表的结构 `inventory_event`
--

CREATE TABLE `inventory_event` (
  `id` int(11) NOT NULL,
  `action` enum('IN','OUT') DEFAULT NULL,
  `mode` varchar(50) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `inventory_event`
--

INSERT INTO `inventory_event` (`id`, `action`, `mode`, `company`, `remark`, `created_at`, `deleted_at`) VALUES
(8, 'IN', 'VALVE_ONLY', '', 'from UI', '2026-04-19 12:14:31', '2026-04-19 12:25:08'),
(9, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 12:14:49', '2026-04-19 12:25:06'),
(11, 'IN', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-19 12:16:21', '2026-04-19 12:25:04'),
(12, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-19 12:19:54', '2026-04-19 12:25:02'),
(13, 'IN', 'VALVE_ONLY', '', 'from UI', '2026-04-19 12:22:04', '2026-04-19 12:25:00'),
(14, 'IN', 'COIL_INDEPENDENT_ONLY', 'test', 'from UI', '2026-04-19 19:24:08', '2026-04-23 09:10:31'),
(15, 'IN', 'COIL_INDEPENDENT_ONLY', 'GOET-VALVE GMBH', 'from UI', '2026-04-19 19:37:01', '2026-04-19 19:47:29'),
(16, 'IN', 'COIL_INDEPENDENT_ONLY', 'GOET/VALVEGMBH', 'from UI', '2026-04-19 19:37:24', '2026-04-19 19:40:02'),
(17, 'IN', 'COIL_INDEPENDENT_ONLY', 'GOETVALVE GM BH', 'from UI', '2026-04-19 19:40:25', '2026-04-19 19:47:26'),
(18, 'IN', 'VALVE_PLUS_STANDARD', 'TEST', 'from UI', '2026-04-20 08:40:56', '2026-04-23 09:11:28'),
(19, 'IN', 'VALVE_PLUS_STANDARD', 'TEST', 'from UI', '2026-04-20 08:41:01', NULL),
(20, 'IN', 'VALVE_PLUS_STANDARD', 'TESTCOMPANY', 'from UI', '2026-04-21 09:45:46', NULL),
(21, 'OUT', 'VALVE_PLUS_STANDARD', 'TESTCOMPANY', 'from UI', '2026-04-21 09:45:55', NULL),
(22, 'IN', 'COIL_INDEPENDENT_ONLY', 'TEST', 'from UI', '2026-04-23 09:10:54', '2026-04-23 09:11:08'),
(23, 'IN', 'VALVE_ONLY', 'TESTCOMPANY', 'from UI', '2026-04-23 11:57:25', NULL),
(24, 'OUT', 'VALVE_ONLY', 'TESTCOMPANY', 'from UI', '2026-04-23 11:57:34', NULL),
(25, 'OUT', 'VALVE_ONLY', 'TEST', 'from UI', '2026-04-23 12:40:44', NULL),
(26, 'IN', 'VALVE_ONLY', 'TEST', 'from UI', '2026-04-23 13:02:09', NULL),
(27, 'OUT', 'VALVE_ONLY', '客户１', 'from UI', '2026-04-23 13:02:41', NULL),
(28, 'IN', 'VALVE_PLUS_INDEPENDENT', '客户2', 'from UI', '2026-04-23 16:27:16', NULL),
(29, 'OUT', 'VALVE_PLUS_INDEPENDENT', '客户2', 'from UI', '2026-04-23 16:27:22', NULL),
(30, 'OUT', 'VALVE_ONLY', '公司1', 'from UI', '2026-04-23 17:31:16', NULL),
(31, 'OUT', 'VALVE_ONLY', '公司2', 'from UI', '2026-04-23 17:31:18', NULL),
(32, 'OUT', 'VALVE_ONLY', '公司3', 'from UI', '2026-04-23 17:31:21', NULL),
(33, 'OUT', 'VALVE_ONLY', '公司4', 'from UI', '2026-04-23 17:31:23', NULL),
(34, 'OUT', 'VALVE_ONLY', '公司5', 'from UI', '2026-04-23 17:31:25', NULL),
(35, 'OUT', 'VALVE_ONLY', '公司6', 'from UI', '2026-04-23 17:31:27', NULL),
(36, 'OUT', 'VALVE_ONLY', '公司7', 'from UI', '2026-04-23 17:31:30', NULL),
(37, 'OUT', 'VALVE_ONLY', '公司8', 'from UI', '2026-04-23 17:31:32', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `inventory_event_item`
--

CREATE TABLE `inventory_event_item` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `item_type` varchar(50) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `inventory_event_item`
--

INSERT INTO `inventory_event_item` (`id`, `event_id`, `item_type`, `item_id`, `quantity`) VALUES
(1, 8, 'valve_body', 1, 1),
(2, 9, 'valve_body', 1, 1),
(3, 9, 'coil_standard', 1, 1),
(4, 11, 'valve_body', 1, 10),
(5, 11, 'coil_independent', 1, 10),
(6, 12, 'valve_body', 1, 10),
(7, 12, 'coil_independent', 1, 10),
(8, 13, 'valve_body', 1, 10),
(9, 14, 'coil_independent', 1, 10),
(10, 15, 'coil_independent', 1, 1),
(11, 16, 'coil_independent', 1, 1),
(12, 17, 'coil_independent', 1, 1),
(13, 18, 'valve_body', 6, 1),
(14, 18, 'coil_standard', 3, 1),
(15, 19, 'valve_body', 6, 10),
(16, 19, 'coil_standard', 3, 10),
(17, 20, 'valve_body', 8, 100),
(18, 20, 'coil_standard', 6, 100),
(19, 21, 'valve_body', 8, 50),
(20, 21, 'coil_standard', 6, 50),
(21, 22, 'coil_independent', 1, 10),
(22, 23, 'valve_body', 12, 100),
(23, 24, 'valve_body', 12, 50),
(24, 25, 'valve_body', 12, 15),
(25, 26, 'valve_body', 9, 100),
(26, 27, 'valve_body', 9, 60),
(27, 28, 'valve_body', 6, 100),
(28, 28, 'coil_independent', 1, 100),
(29, 29, 'valve_body', 6, 50),
(30, 29, 'coil_independent', 1, 50),
(31, 30, 'valve_body', 12, 1),
(32, 31, 'valve_body', 12, 1),
(33, 32, 'valve_body', 12, 1),
(34, 33, 'valve_body', 12, 1),
(35, 34, 'valve_body', 12, 1),
(36, 35, 'valve_body', 12, 1),
(37, 36, 'valve_body', 12, 1),
(38, 37, 'valve_body', 12, 1);

-- --------------------------------------------------------

--
-- 表的结构 `valve_body`
--

CREATE TABLE `valve_body` (
  `id` int(11) NOT NULL,
  `model_number` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `inner_diameter_mm` decimal(6,2) DEFAULT NULL,
  `temp_min_c` int(11) DEFAULT NULL,
  `temp_max_c` int(11) DEFAULT NULL,
  `pressure_min_bar` decimal(6,2) DEFAULT NULL,
  `pressure_max_bar` decimal(6,2) DEFAULT NULL,
  `connection` varchar(50) DEFAULT NULL,
  `model_number_active` varchar(100) GENERATED ALWAYS AS (case when `deleted_at` is null then `model_number` else NULL end) STORED,
  `image_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `valve_body`
--

INSERT INTO `valve_body` (`id`, `model_number`, `category`, `manufacturer`, `created_at`, `deleted_at`, `inner_diameter_mm`, `temp_min_c`, `temp_max_c`, `pressure_min_bar`, `pressure_max_bar`, `connection`, `image_url`) VALUES
(1, 'test1', 'test1', 'testCompany1', '2026-04-19 12:13:49', '2026-04-19 12:24:08', 10.00, 10, 100, 0.00, 100.00, 'G1/4', NULL),
(2, 't', 't', 't', '2026-04-19 12:25:50', '2026-04-19 12:25:54', 0.00, 0, 0, 0.00, 0.00, '', NULL),
(3, 'testbody', 'test', 'test', '2026-04-19 12:32:13', '2026-04-19 12:33:07', 0.00, 0, 0, 0.00, 0.00, '', NULL),
(4, 'test', '通用电磁阀', 'GOETVALVE', '2026-04-19 18:58:04', NULL, 10.00, 1, 11, 1.00, 1.00, 'G1/4', NULL),
(5, '7050.004', '通用电磁阀', 'GOETVALVE', '2026-04-19 19:07:04', NULL, 0.00, 0, 0, 0.00, 0.00, '', NULL),
(6, '6610VN4.0 AC110', '通用电磁阀', 'JAKSA', '2026-04-19 19:08:28', NULL, 0.00, 0, 0, 0.00, 0.00, '', NULL),
(7, 'test1', '通用电磁阀', 'JAKSA', '2026-04-20 08:56:06', '2026-04-20 08:56:31', 1.00, 1, 11, 1.00, 11.00, 'g1/4', NULL),
(8, 'testjaksa', '通用电磁阀', 'JAKSA', '2026-04-21 09:45:09', '2026-04-23 11:56:27', 1.00, 1, 1, 1.00, 1.00, '1', NULL),
(9, '7100', '通用电磁阀', 'GOETVALVE', '2026-04-21 10:54:24', NULL, 10.00, 1, 11, 1.00, 11.00, 'G1/4', NULL),
(10, 'testimg', '通用电磁阀', 'GOETVALVE', '2026-04-23 10:17:15', '2026-04-23 10:19:38', 1.00, 1, 11, 1.00, 1.00, '1', NULL),
(11, 'testimg', '通用电磁阀', 'GOETVALVE', '2026-04-23 10:20:09', NULL, 0.00, 1, 11, 1.00, 11.00, '1', 'https://gsvi.cc/images/8700-3.png'),
(12, 'testreport', '通用电磁阀', 'JAKSA', '2026-04-23 11:56:41', NULL, 1.00, 1, 11, 1.00, 1.00, '1', 'https://gsvi.cc/images/8800.png');

--
-- 触发器 `valve_body`
--
DELIMITER $$
CREATE TRIGGER `trg_valve_body_soft_delete` AFTER UPDATE ON `valve_body` FOR EACH ROW BEGIN

    -- 只在“从未删除 → 已删除”的瞬间触发
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN

        UPDATE coil_standard
        SET deleted_at = NOW()
        WHERE coil_model = OLD.model_number
          AND deleted_at IS NULL;

    END IF;

END
$$
DELIMITER ;

--
-- 转储表的索引
--

--
-- 表的索引 `coil_independent`
--
ALTER TABLE `coil_independent`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_coil_idp_active` (`unique_key_active`);

--
-- 表的索引 `coil_standard`
--
ALTER TABLE `coil_standard`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_coil_standard_active` (`unique_key_active`);

--
-- 表的索引 `inventory_event`
--
ALTER TABLE `inventory_event`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `inventory_event_item`
--
ALTER TABLE `inventory_event_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- 表的索引 `valve_body`
--
ALTER TABLE `valve_body`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_valve_body_model_number_active` (`model_number_active`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `coil_independent`
--
ALTER TABLE `coil_independent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `coil_standard`
--
ALTER TABLE `coil_standard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用表AUTO_INCREMENT `inventory_event`
--
ALTER TABLE `inventory_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- 使用表AUTO_INCREMENT `inventory_event_item`
--
ALTER TABLE `inventory_event_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- 使用表AUTO_INCREMENT `valve_body`
--
ALTER TABLE `valve_body`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 限制导出的表
--

--
-- 限制表 `inventory_event_item`
--
ALTER TABLE `inventory_event_item`
  ADD CONSTRAINT `inventory_event_item_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `inventory_event` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
