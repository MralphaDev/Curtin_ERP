-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1:3306
-- 生成日期： 2026-04-19 12:08:03
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
  `unique_key_active` varchar(255) GENERATED ALWAYS AS (case when `deleted_at` is null then `coil_idp_model` else NULL end) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `coil_independent`
--

INSERT INTO `coil_independent` (`id`, `coil_idp_model`, `voltage`, `manufacturer`, `created_at`, `deleted_at`) VALUES
(1, 'coil_indp_test1', '120VAC', 'goetvalve', '2026-04-17 11:57:58', NULL),
(2, 'test2', '24VAC', 'goetvalve', '2026-04-19 11:05:23', NULL);

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
  `unique_key_active` varchar(255) GENERATED ALWAYS AS (case when `deleted_at` is null then `coil_model` else NULL end) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `coil_standard`
--

INSERT INTO `coil_standard` (`id`, `coil_model`, `voltage`, `manufacturer`, `created_at`, `deleted_at`) VALUES
(1, 'test', '24VAC', 'goetvalve', '2026-04-19 08:23:22', '2026-04-19 08:36:19'),
(2, 'test_body', '24VAC', 'goetvalve', '2026-04-19 08:37:14', '2026-04-19 10:52:30'),
(3, 'testbody', '24VAC', 'goetvalve', '2026-04-19 10:53:20', '2026-04-19 10:53:35'),
(4, '7100.015.045', '24VAC', 'test', '2026-04-19 11:30:43', NULL);

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
(6, 'IN', 'VALVE_PLUS_STANDARD', 'test2', 'from UI', '2026-04-17 10:15:46', '2026-04-18 17:02:31'),
(7, 'IN', 'VALVE_ONLY', 'test', 'from UI', '2026-04-17 18:09:23', '2026-04-18 17:02:33'),
(8, 'IN', 'COIL_STANDARD_ONLY', 'test', 'from UI', '2026-04-17 18:10:02', '2026-04-18 17:02:35'),
(9, 'IN', 'COIL_INDEPENDENT_ONLY', 'test', 'from UI', '2026-04-17 18:10:31', '2026-04-18 17:02:37'),
(10, 'IN', 'COIL_INDEPENDENT_ONLY', 'test', 'from UI', '2026-04-17 18:10:32', '2026-04-18 17:02:39'),
(11, 'IN', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-17 18:12:55', '2026-04-18 17:02:40'),
(18, 'IN', 'VALVE_PLUS_INDEPENDENT', 'test', 'from UI', '2026-04-17 18:27:16', '2026-04-17 18:43:01'),
(19, 'IN', 'VALVE_ONLY', 'test', 'from UI', '2026-04-17 19:48:29', '2026-04-18 17:02:42'),
(20, 'OUT', 'VALVE_ONLY', 'test', 'from UI', '2026-04-17 19:49:01', '2026-04-18 17:02:44'),
(21, 'IN', 'VALVE_PLUS_INDEPENDENT', 'test', 'from UI', '2026-04-17 19:49:40', '2026-04-18 11:19:07'),
(22, 'OUT', 'VALVE_PLUS_INDEPENDENT', 'test', 'from UI', '2026-04-17 19:50:07', '2026-04-18 11:19:31'),
(23, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 08:02:59', '2026-04-18 08:04:41'),
(24, 'OUT', 'VALVE_PLUS_STANDARD', '4.18test', 'from UI', '2026-04-18 08:05:56', '2026-04-18 17:02:45'),
(25, 'IN', 'VALVE_PLUS_INDEPENDENT', 'test12', 'from UI', '2026-04-18 08:32:51', '2026-04-18 17:02:47'),
(26, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-18 08:37:18', '2026-04-18 17:02:49'),
(28, 'IN', 'VALVE_PLUS_INDEPENDENT', 't', 'from UI', '2026-04-18 08:43:19', '2026-04-18 17:02:51'),
(29, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-18 08:52:17', '2026-04-18 17:02:52'),
(30, 'IN', 'VALVE_PLUS_INDEPENDENT', 'r', 'from UI', '2026-04-18 08:55:37', '2026-04-18 17:02:54'),
(31, 'OUT', 'VALVE_PLUS_INDEPENDENT', 'rr', 'from UI', '2026-04-18 09:00:15', '2026-04-18 17:02:56'),
(32, 'IN', 'VALVE_PLUS_INDEPENDENT', 're', 'from UI', '2026-04-18 09:06:12', '2026-04-18 17:02:57'),
(33, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-18 09:11:52', '2026-04-18 17:03:32'),
(34, 'IN', 'VALVE_PLUS_INDEPENDENT', 'rt', 'from UI', '2026-04-18 09:27:50', '2026-04-18 17:03:30'),
(35, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-18 09:30:55', '2026-04-18 17:03:27'),
(36, 'IN', 'VALVE_PLUS_INDEPENDENT', 'rt', 'from UI', '2026-04-18 09:33:50', '2026-04-18 17:03:26'),
(39, 'OUT', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-18 10:07:50', '2026-04-18 17:03:24'),
(40, 'IN', 'VALVE_PLUS_INDEPENDENT', 'ttt', 'from UI', '2026-04-18 10:22:50', '2026-04-18 17:03:23'),
(41, 'IN', 'VALVE_ONLY', 'rr', 'from UI', '2026-04-18 10:26:09', '2026-04-18 17:03:21'),
(42, 'IN', 'COIL_INDEPENDENT_ONLY', 'test', 'from UI', '2026-04-18 11:21:44', '2026-04-18 17:03:19'),
(43, 'OUT', 'COIL_INDEPENDENT_ONLY', 'r', 'from UI', '2026-04-18 11:21:56', '2026-04-18 17:03:17'),
(44, 'IN', 'VALVE_PLUS_INDEPENDENT', '100Company', 'from UI', '2026-04-18 13:07:55', '2026-04-18 17:03:16'),
(45, 'OUT', 'VALVE_PLUS_INDEPENDENT', 'testt', 'from UI', '2026-04-18 13:12:48', '2026-04-18 17:03:14'),
(47, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 15:34:10', '2026-04-18 15:42:07'),
(48, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 15:34:45', '2026-04-18 15:41:41'),
(49, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 15:34:50', '2026-04-18 15:41:05'),
(50, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 15:34:53', '2026-04-18 15:40:29'),
(51, 'IN', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-18 15:42:55', '2026-04-18 15:55:03'),
(52, 'OUT', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-18 15:43:31', '2026-04-18 15:45:56'),
(53, 'IN', 'VALVE_PLUS_STANDARD', '17:53', 'from UI', '2026-04-18 15:53:18', '2026-04-18 15:53:40'),
(54, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:03:04', '2026-04-18 16:03:27'),
(55, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:09:57', '2026-04-18 16:10:16'),
(56, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:13:29', '2026-04-18 16:13:45'),
(57, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:14:11', '2026-04-18 16:14:22'),
(58, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:19:28', '2026-04-18 16:19:39'),
(59, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:21:19', '2026-04-18 16:22:08'),
(60, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:22:56', '2026-04-18 16:23:06'),
(61, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-18 16:30:41', '2026-04-18 16:32:05'),
(62, 'IN', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-18 17:04:20', '2026-04-18 17:04:37'),
(63, 'IN', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-18 17:17:38', '2026-04-18 18:47:42'),
(64, 'OUT', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-18 17:18:20', '2026-04-18 17:18:29'),
(65, 'IN', 'VALVE_ONLY', '', 'from UI', '2026-04-18 17:21:49', '2026-04-18 17:26:00'),
(66, 'IN', 'VALVE_ONLY', '', 'from UI', '2026-04-18 17:21:51', '2026-04-18 17:25:58'),
(67, 'OUT', 'VALVE_ONLY', '', 'from UI', '2026-04-18 17:22:12', '2026-04-18 17:25:56'),
(68, 'IN', 'VALVE_PLUS_STANDARD', 'JAKSA', 'from UI', '2026-04-18 18:46:04', '2026-04-19 07:49:02'),
(69, 'IN', 'VALVE_PLUS_STANDARD', 'test', 'from UI', '2026-04-19 08:33:10', '2026-04-19 08:36:11'),
(70, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 08:37:27', '2026-04-19 10:59:19'),
(71, 'OUT', 'VALVE_PLUS_STANDARD', '4/19', 'from UI', '2026-04-19 09:23:57', '2026-04-19 09:56:23'),
(72, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:56:08', '2026-04-19 09:56:18'),
(73, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:56:08', '2026-04-19 09:56:20'),
(74, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:56:24', '2026-04-19 09:57:55'),
(75, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:56:24', '2026-04-19 10:02:27'),
(76, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:57:00', '2026-04-19 09:57:04'),
(77, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 09:57:00', '2026-04-19 09:57:23'),
(78, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 10:02:21', '2026-04-19 10:02:25'),
(79, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 10:02:29', '2026-04-19 10:59:11'),
(80, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 10:02:29', '2026-04-19 10:59:13'),
(81, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 10:02:29', '2026-04-19 10:59:15'),
(82, 'OUT', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 10:02:29', '2026-04-19 10:59:17'),
(83, 'IN', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-19 11:07:32', '2026-04-19 11:25:21'),
(84, 'IN', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-19 11:26:28', '2026-04-19 11:26:51'),
(85, 'IN', 'VALVE_PLUS_STANDARD', '', 'from UI', '2026-04-19 11:31:02', '2026-04-19 11:31:21'),
(86, 'IN', 'VALVE_PLUS_INDEPENDENT', '', 'from UI', '2026-04-19 11:56:33', NULL);

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
(6, 6, 'valve_body', 3, 3),
(7, 6, 'coil_standard', 2, 3),
(8, 7, 'valve_body', 1, 10),
(9, 8, 'coil_standard', 6, 7),
(10, 9, 'coil_independent', 1, 14),
(11, 10, 'coil_independent', 1, 14),
(12, 11, 'valve_body', 5, 7),
(13, 11, 'coil_standard', 3, 7),
(20, 18, 'valve_body', 2, 1),
(21, 18, 'coil_independent', 1, 1),
(22, 19, 'valve_body', 7, 1),
(23, 20, 'valve_body', 7, 1),
(24, 21, 'valve_body', 11, 11),
(25, 21, 'coil_independent', 1, 11),
(26, 22, 'valve_body', 11, 11),
(27, 22, 'coil_independent', 1, 11),
(28, 23, 'valve_body', 1, 9),
(29, 23, 'coil_standard', 1, 9),
(30, 24, 'valve_body', 1, 9),
(31, 24, 'coil_standard', 1, 9),
(32, 25, 'valve_body', 1, 1),
(33, 25, 'coil_independent', 1, 1),
(34, 26, 'valve_body', 1, 1),
(35, 26, 'coil_independent', 1, 1),
(37, 28, 'valve_body', 1, 1),
(38, 28, 'coil_independent', 1, 1),
(39, 29, 'valve_body', 1, 1),
(40, 29, 'coil_independent', 1, 1),
(41, 30, 'valve_body', 1, 1),
(42, 30, 'coil_independent', 1, 1),
(43, 31, 'valve_body', 1, 1),
(44, 31, 'coil_independent', 1, 1),
(45, 32, 'valve_body', 1, 1),
(46, 32, 'coil_independent', 1, 1),
(47, 33, 'valve_body', 1, 1),
(48, 33, 'coil_independent', 1, 1),
(49, 34, 'valve_body', 1, 1),
(50, 34, 'coil_independent', 1, 1),
(51, 35, 'valve_body', 1, 1),
(52, 35, 'coil_independent', 1, 1),
(53, 36, 'valve_body', 1, 1),
(54, 36, 'coil_independent', 1, 1),
(55, 39, 'valve_body', 1, 1),
(56, 39, 'coil_independent', 1, 1),
(57, 40, 'valve_body', 1, 1),
(58, 40, 'coil_independent', 1, 1),
(59, 41, 'valve_body', 15, 1),
(60, 42, 'coil_independent', 1, 1),
(61, 43, 'coil_independent', 1, 1),
(62, 44, 'valve_body', 19, 100),
(63, 44, 'coil_independent', 1, 100),
(64, 45, 'valve_body', 19, 99),
(65, 45, 'coil_independent', 1, 99),
(67, 47, 'valve_body', 2, 1),
(68, 47, 'coil_standard', 17, 1),
(69, 48, 'valve_body', 2, 1),
(70, 48, 'coil_standard', 17, 1),
(71, 49, 'valve_body', 2, 1),
(72, 49, 'coil_standard', 17, 1),
(73, 50, 'valve_body', 2, 1),
(74, 50, 'coil_standard', 17, 1),
(75, 51, 'valve_body', 2, 10),
(76, 51, 'coil_standard', 17, 10),
(77, 52, 'valve_body', 2, 5),
(78, 52, 'coil_standard', 17, 5),
(79, 53, 'valve_body', 2, 10),
(80, 53, 'coil_standard', 17, 10),
(81, 54, 'valve_body', 2, 10),
(82, 54, 'coil_standard', 17, 10),
(83, 55, 'valve_body', 2, 10),
(84, 55, 'coil_standard', 17, 10),
(85, 56, 'valve_body', 2, 10),
(86, 56, 'coil_standard', 17, 10),
(87, 57, 'valve_body', 2, 100),
(88, 57, 'coil_standard', 17, 100),
(89, 58, 'valve_body', 2, 100),
(90, 58, 'coil_standard', 17, 100),
(91, 59, 'valve_body', 2, 100),
(92, 59, 'coil_standard', 17, 100),
(93, 60, 'valve_body', 2, 100),
(94, 60, 'coil_standard', 17, 100),
(95, 61, 'valve_body', 2, 1),
(96, 61, 'coil_standard', 17, 1),
(97, 62, 'valve_body', 2, 100),
(98, 62, 'coil_standard', 17, 100),
(99, 63, 'valve_body', 2, 10),
(100, 63, 'coil_standard', 17, 10),
(101, 64, 'valve_body', 2, 1),
(102, 64, 'coil_standard', 17, 1),
(103, 65, 'valve_body', 22, 1),
(104, 66, 'valve_body', 22, 1),
(105, 67, 'valve_body', 22, 1),
(106, 68, 'valve_body', 23, 10),
(107, 68, 'coil_standard', 18, 10),
(108, 69, 'valve_body', 26, 10),
(109, 69, 'coil_standard', 1, 10),
(110, 70, 'valve_body', 27, 10),
(111, 70, 'coil_standard', 2, 10),
(112, 71, 'valve_body', 27, 1),
(113, 71, 'coil_standard', 2, 1),
(114, 72, 'valve_body', 27, 1),
(115, 72, 'coil_standard', 2, 1),
(116, 73, 'valve_body', 27, 1),
(117, 73, 'coil_standard', 2, 1),
(118, 74, 'valve_body', 27, 1),
(119, 74, 'coil_standard', 2, 1),
(120, 75, 'valve_body', 27, 1),
(121, 75, 'coil_standard', 2, 1),
(122, 76, 'valve_body', 27, 1),
(123, 76, 'coil_standard', 2, 1),
(124, 77, 'valve_body', 27, 1),
(125, 77, 'coil_standard', 2, 1),
(126, 78, 'valve_body', 27, 1),
(127, 78, 'coil_standard', 2, 1),
(128, 79, 'valve_body', 27, 1),
(129, 79, 'coil_standard', 2, 1),
(130, 80, 'valve_body', 27, 1),
(131, 80, 'coil_standard', 2, 1),
(132, 81, 'valve_body', 27, 1),
(133, 81, 'coil_standard', 2, 1),
(134, 82, 'valve_body', 27, 1),
(135, 82, 'coil_standard', 2, 1),
(136, 83, 'valve_body', 29, 10),
(137, 83, 'coil_independent', 2, 10),
(138, 84, 'valve_body', 23, 100),
(139, 84, 'coil_independent', 2, 100),
(140, 85, 'valve_body', 23, 1),
(141, 85, 'coil_standard', 4, 1),
(142, 86, 'valve_body', 23, 10),
(143, 86, 'coil_independent', 2, 10);

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
  `model_number_active` varchar(100) GENERATED ALWAYS AS (case when `deleted_at` is null then `model_number` else NULL end) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `valve_body`
--

INSERT INTO `valve_body` (`id`, `model_number`, `category`, `manufacturer`, `created_at`, `deleted_at`, `inner_diameter_mm`, `temp_min_c`, `temp_max_c`, `pressure_min_bar`, `pressure_max_bar`, `connection`) VALUES
(1, 'VL-1001', 'ball valve', 'rotork', '2025-01-10 09:15:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'VL-1002', 'gate valve', 'goetvalve', '2025-01-11 10:20:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'VL-1003', 'globe valve', 'ceme', '2025-01-12 11:25:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'VL-1004', 'check valve', 'jaksa', '2025-01-13 12:30:00', '2026-04-17 19:06:35', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'VL-1005', 'butterfly valve', 'rotork', '2025-01-14 13:35:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'VL-1006', 'pressure relief valve', 'goetvalve', '2025-01-15 14:40:00', '2026-04-17 19:42:05', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'VL-1007', 'control valve', 'ceme', '2025-01-16 15:45:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'VL-1008', 'plug valve', 'jaksa', '2025-01-17 16:50:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'VL-1009', 'diaphragm valve', 'rotork', '2025-01-18 17:55:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'VL-1010', 'needle valve', 'goetvalve', '2025-01-19 18:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'VL-1011', 'solenoid valve ', 'goetvalve', '2026-04-17 11:10:14', '2026-04-18 11:12:53', NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'VL-1012', 'ball valve', 'goetvalve', '2026-04-18 10:09:31', '2026-04-18 10:09:51', 10.00, -150, 150, 0.00, 15.00, 'G1/4'),
(14, 'VL-1012', '1', '1', '2026-04-18 10:13:08', '2026-04-18 10:13:59', 1.00, 1, 1, 1.00, 1.00, '1'),
(15, 'VL-1012', '1', '1', '2026-04-18 10:14:10', NULL, 1.00, 1, 1, 1.00, 1.00, '1'),
(17, 'VL-1011', '1', '1', '2026-04-18 11:13:04', NULL, 1.00, 1, 1, 1.00, 1.00, '1'),
(18, 'VL-1013', 'gate valve', 'ceme', '2026-04-18 11:52:04', NULL, 10.00, -150, 150, 10.00, 100.00, 'G1/4'),
(19, 'VL-1014', 'gate valve', 'goetvalve', '2026-04-18 12:51:59', NULL, 10.00, 1, 100, 10.00, 50.00, 'G1/4'),
(20, 'D223 230VAC', '1', '1', '2026-04-18 13:36:52', '2026-04-18 13:43:11', 1.00, 1, 1, 1.00, 1.00, '1'),
(21, 'VL-1015', 'solenoid valve ', 'goetvalve', '2026-04-18 15:02:02', '2026-04-18 15:04:05', 10.00, 0, 150, 0.00, 50.00, 'G1/4'),
(22, 'test', 't', 't', '2026-04-18 17:19:48', '2026-04-18 17:23:02', 1.00, 1, 1, 1.00, 1.00, '1'),
(23, '7100.015.045', '超低温电磁阀', 'GOETVALVE', '2026-04-18 18:41:04', NULL, 7.00, -196, 90, 0.00, 20.00, 'G1/2'),
(24, 'test', '1', '1', '2026-04-18 20:03:30', '2026-04-18 20:25:46', 1.00, 1, 1, 1.00, 1.00, '1'),
(25, 'test', '1', '1', '2026-04-19 07:52:00', '2026-04-19 08:12:04', 1.00, 1, 1, 1.00, 1.00, '1'),
(26, 'test', 'solenoid valve', 'goetvalve', '2026-04-19 08:13:00', '2026-04-19 08:36:29', 19.00, -150, 150, 0.00, 100.00, 'G1/4'),
(27, 'test_body', 'solenoid valve', 'goetvalve', '2026-04-19 08:36:59', '2026-04-19 10:16:15', 10.00, 0, 100, 0.00, 50.00, 'G1/4'),
(28, 'testbody', 'test', 'test', '2026-04-19 10:53:07', '2026-04-19 10:53:35', 10.00, 10, 110, 10.00, 100.00, 'G1/4'),
(29, 'testbody', 'test', 'test', '2026-04-19 11:05:03', '2026-04-19 11:16:37', 1.00, 1, 1, 1.00, 1.00, 'G1/4');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `inventory_event`
--
ALTER TABLE `inventory_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- 使用表AUTO_INCREMENT `inventory_event_item`
--
ALTER TABLE `inventory_event_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- 使用表AUTO_INCREMENT `valve_body`
--
ALTER TABLE `valve_body`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
