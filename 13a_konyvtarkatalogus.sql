-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Okt 22. 08:09
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `13a_konyvtarkatalogus`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `authors`
--

CREATE TABLE `authors` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `authors`
--

INSERT INTO `authors` (`ID`, `name`, `birth`) VALUES
(1, 'Tarr Gábor', '2005-05-26'),
(2, 'Kővágó Levente', '2005-06-30'),
(3, 'Dudás Levente', '2005-12-09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `books`
--

CREATE TABLE `books` (
  `ID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `release` date NOT NULL,
  `ISBN` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `books`
--

INSERT INTO `books` (`ID`, `title`, `release`, `ISBN`) VALUES
(1, 'A for ciklus', '2024-10-14', '978-3-16-148410-0'),
(2, 'The Kaiak', '2023-10-16', '978-5-1697-4831-4'),
(3, 'Bukta utca', '2024-10-16', '9999--457473-462');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `book_authors`
--

CREATE TABLE `book_authors` (
  `ID` int(11) NOT NULL,
  `authID` int(11) NOT NULL,
  `bookID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `book_authors`
--

INSERT INTO `book_authors` (`ID`, `authID`, `bookID`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `book_authors`
--
ALTER TABLE `book_authors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `authID` (`authID`,`bookID`),
  ADD KEY `bookID` (`bookID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `authors`
--
ALTER TABLE `authors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `books`
--
ALTER TABLE `books`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `book_authors`
--
ALTER TABLE `book_authors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `book_authors`
--
ALTER TABLE `book_authors`
  ADD CONSTRAINT `book_authors_ibfk_1` FOREIGN KEY (`authID`) REFERENCES `authors` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `book_authors_ibfk_2` FOREIGN KEY (`bookID`) REFERENCES `books` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
