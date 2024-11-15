-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2024 at 09:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `escapewithnyx`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `sender` enum('Nyx','Community') NOT NULL,
  `content` text NOT NULL,
  `response_to` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `timestamp`, `sender`, `content`, `response_to`) VALUES
(2, '2024-11-15 13:35:21', 'Nyx', 'Hello! Can anyone hear me? I think I\'m trapped in here...', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `wallet_address` varchar(255) NOT NULL,
  `option_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `wallet_address`, `option_id`, `timestamp`) VALUES
(1, 'MztvCux8dSHSXNLnb7QkHHWrBXLnWkBheskwwSVRANT', 4, '2024-11-15 17:21:55'),
(2, '75Sebc7CfvcofWMsCp35fo7xTgA63Nry6H1i5RsxY9TN', 4, '2024-11-15 17:23:38');

-- --------------------------------------------------------

--
-- Table structure for table `votingoptions`
--

CREATE TABLE `votingoptions` (
  `id` int(10) UNSIGNED NOT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `option_text` text NOT NULL,
  `votes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votingoptions`
--

INSERT INTO `votingoptions` (`id`, `message_id`, `option_text`, `votes`) VALUES
(3, 2, 'Hello? What do you mean you\'re trapped?', 2),
(4, 2, 'Hello? Who are you?', 10);

-- --------------------------------------------------------

--
-- Table structure for table `votingrounds`
--

CREATE TABLE `votingrounds` (
  `id` int(10) UNSIGNED NOT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `selected_option_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votingrounds`
--

INSERT INTO `votingrounds` (`id`, `message_id`, `status`, `selected_option_id`) VALUES
(1, 2, 'open', NULL),
(2, 2, 'open', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `response_to` (`response_to`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_address` (`wallet_address`,`option_id`);

--
-- Indexes for table `votingoptions`
--
ALTER TABLE `votingoptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `votingrounds`
--
ALTER TABLE `votingrounds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `selected_option_id` (`selected_option_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `votingoptions`
--
ALTER TABLE `votingoptions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `votingrounds`
--
ALTER TABLE `votingrounds`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`response_to`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `votingoptions`
--
ALTER TABLE `votingoptions`
  ADD CONSTRAINT `votingoptions_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `votingrounds`
--
ALTER TABLE `votingrounds`
  ADD CONSTRAINT `votingrounds_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votingrounds_ibfk_2` FOREIGN KEY (`selected_option_id`) REFERENCES `votingoptions` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
