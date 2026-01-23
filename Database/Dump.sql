CREATE DATABASE  IF NOT EXISTS `campusdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `campusdb`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: campusdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_students_user` (`user_id`),
  CONSTRAINT `fk_admins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,1,'System','Admin','admin@example.com','9000000000','OTHER',NULL),(3,10,'System','Administrator','admin.test01@example.com','9000000001','OTHER',NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `assignment_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_course_subject_id` bigint NOT NULL,
  `created_by_user_id` bigint NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `due_date` datetime NOT NULL,
  `status` enum('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  KEY `idx_batch_course_subject_id` (`batch_course_subject_id`),
  KEY `idx_created_by` (`created_by_user_id`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_assignments_bcs` FOREIGN KEY (`batch_course_subject_id`) REFERENCES `batch_course_subjects` (`batch_course_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_assignments_created_by` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,1,2,'Communication Basics Assignment','Write a short essay explaining the importance of effective communication in professional environments.','ec_comm_basics.pdf','/assignments/ec_comm_basics.pdf','application/pdf','2025-03-15 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(2,1,2,'Listening Skills Exercise','Prepare a report on active listening techniques with real-life examples.','ec_listening_skills.pdf','/assignments/ec_listening_skills.pdf','application/pdf','2025-03-25 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(3,1,2,'Presentation Skills Task','Create a 5-minute presentation on a technical topic of your choice.','ec_presentation_skills.pdf','/assignments/ec_presentation_skills.pdf','application/pdf','2025-04-05 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(4,1,2,'Group Discussion Reflection','Submit a reflection document describing your experience in a group discussion session.','ec_group_discussion.pdf','/assignments/ec_group_discussion.pdf','application/pdf','2025-04-15 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(5,2,2,'Servlet Basics Assignment','Implement a basic servlet that handles GET and POST requests.','wbjp_servlet_basics.pdf','/assignments/wbjp_servlet_basics.pdf','application/pdf','2025-03-20 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(6,2,2,'JSP Form Handling Task','Create a JSP-based form and process user input on the server side.','wbjp_jsp_forms.pdf','/assignments/wbjp_jsp_forms.pdf','application/pdf','2025-04-10 23:59:59','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_create_submissions_on_assignment` AFTER INSERT ON `assignments` FOR EACH ROW BEGIN
    INSERT INTO submissions (
        assignment_id,
        student_user_id,
        status
    )
    SELECT
        NEW.assignment_id,
        s.user_id,          -- student_user_id
        'NOT_SUBMITTED'
    FROM students s
    JOIN batch_course_subjects bcs
        ON bcs.batch_course_subject_id = NEW.batch_course_subject_id
    WHERE s.batch_course_id = bcs.batch_course_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `batch_course_subjects`
--

DROP TABLE IF EXISTS `batch_course_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_course_subjects` (
  `batch_course_subject_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_course_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_course_subject_id`),
  UNIQUE KEY `uq_batch_course_subject` (`batch_course_id`,`subject_id`),
  KEY `idx_batch_course_id` (`batch_course_id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `fk_bcs_batch_course` FOREIGN KEY (`batch_course_id`) REFERENCES `batch_courses` (`batch_course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bcs_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_course_subjects`
--

LOCK TABLES `batch_course_subjects` WRITE;
/*!40000 ALTER TABLE `batch_course_subjects` DISABLE KEYS */;
INSERT INTO `batch_course_subjects` VALUES (1,1,1,'2026-01-22 20:35:06'),(2,1,11,'2026-01-22 20:35:06'),(3,2,1,'2026-01-22 20:35:06'),(4,3,1,'2026-01-22 20:35:06'),(5,4,1,'2026-01-22 20:35:06'),(6,5,1,'2026-01-22 20:35:06'),(7,5,11,'2026-01-22 20:35:06'),(8,6,1,'2026-01-22 20:35:06'),(9,7,1,'2026-01-22 20:35:06'),(10,8,1,'2026-01-22 20:35:06');
/*!40000 ALTER TABLE `batch_course_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_courses`
--

DROP TABLE IF EXISTS `batch_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_courses` (
  `batch_course_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_course_id`),
  UNIQUE KEY `uq_batch_course` (`batch_id`,`course_id`),
  KEY `idx_batch_id` (`batch_id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `fk_batch_courses_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_batch_courses_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_courses`
--

LOCK TABLES `batch_courses` WRITE;
/*!40000 ALTER TABLE `batch_courses` DISABLE KEYS */;
INSERT INTO `batch_courses` VALUES (1,251,1,'2025-02-04','2025-08-22','2026-01-22 20:35:06'),(2,251,2,'2025-02-04','2025-08-22','2026-01-22 20:35:06'),(3,251,3,'2025-02-04','2025-08-22','2026-01-22 20:35:06'),(4,251,4,'2025-02-04','2025-08-22','2026-01-22 20:35:06'),(5,252,1,'2025-08-22','2026-02-04','2026-01-22 20:35:06'),(6,252,2,'2025-08-22','2026-02-04','2026-01-22 20:35:06'),(7,252,3,'2025-08-22','2026-02-04','2026-01-22 20:35:06'),(8,252,4,'2025-08-22','2026-02-04','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `batch_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batches` (
  `batch_id` bigint NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('UPCOMING','ACTIVE','COMPLETED') NOT NULL DEFAULT 'UPCOMING',
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_id`),
  UNIQUE KEY `batch_name` (`batch_name`),
  KEY `idx_batch_name` (`batch_name`),
  KEY `idx_status` (`status`),
  CONSTRAINT `chk_batch_dates` CHECK ((`end_date` > `start_date`))
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batches`
--

LOCK TABLES `batches` WRITE;
/*!40000 ALTER TABLE `batches` DISABLE KEYS */;
INSERT INTO `batches` VALUES (251,'FEB_2025','2025-02-04','2025-08-22','COMPLETED','February 2025 batch','2026-01-22 20:35:06','2026-01-22 20:35:06'),(252,'AUG_2025','2025-08-22','2026-02-04','ACTIVE','August 2025 batch','2026-01-22 20:35:06','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` bigint NOT NULL AUTO_INCREMENT,
  `course_code` varchar(50) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `duration_months` int NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `idx_course_code` (`course_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'PG-DAC','PG Diploma in Advanced Computing',6,'ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(2,'PG-DBDA','PG Diploma in Big Data Analytics',6,'ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(3,'PG-DTSS','PG Diploma in IT Infrastructure, Systems and Security',6,'ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(4,'PG-DAI','PG Diploma in Artificial Intelligence',6,'ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `faculty_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_faculties_user` (`user_id`),
  CONSTRAINT `fk_faculties_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,2,'Pankaj','Jagasia','pankaj.jagasia@example.com','9123456780','MALE',NULL),(2,3,'Eileen','Bartakke','eileen.bartakke@example.com','9123456781','FEMALE',NULL),(3,4,'Vishwanath','K','vishwanath.k@example.com','9123456782','MALE',NULL);
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty_assignments`
--

DROP TABLE IF EXISTS `faculty_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_assignments` (
  `assignment_id` bigint NOT NULL AUTO_INCREMENT,
  `faculty_id` bigint NOT NULL,
  `batch_course_subject_id` bigint NOT NULL,
  `assigned_date` date NOT NULL DEFAULT (curdate()),
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `uq_faculty_bcs` (`faculty_id`,`batch_course_subject_id`),
  KEY `idx_user_id` (`faculty_id`),
  KEY `idx_batch_course_subject_id` (`batch_course_subject_id`),
  CONSTRAINT `fk_fa_batch_course_subject` FOREIGN KEY (`batch_course_subject_id`) REFERENCES `batch_course_subjects` (`batch_course_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_fa_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty_assignments`
--

LOCK TABLES `faculty_assignments` WRITE;
/*!40000 ALTER TABLE `faculty_assignments` DISABLE KEYS */;
INSERT INTO `faculty_assignments` VALUES (1,2,1,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(2,3,1,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(3,1,2,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(4,2,3,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(5,3,3,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(6,2,4,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(7,3,4,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(8,2,5,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(9,3,5,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(10,2,6,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(11,3,6,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(12,1,7,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(13,2,8,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(14,3,8,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(15,2,9,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(16,3,9,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(17,2,10,'2026-01-23','ACTIVE','2026-01-22 20:35:06'),(18,3,10,'2026-01-23','ACTIVE','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `faculty_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `batch_course_id` bigint NOT NULL,
  `prn` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `prn` (`prn`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_students_batch_course` (`batch_course_id`),
  KEY `idx_students_user` (`user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_prn` (`prn`),
  CONSTRAINT `fk_students_batch_course` FOREIGN KEY (`batch_course_id`) REFERENCES `batch_courses` (`batch_course_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,5,1,'PRN251001','Aarav','Sharma','aarav.sharma@example.com','9876543210','MALE',NULL),(2,6,2,'PRN251002','Riya','Patel','riya.patel@example.com','9876543211','FEMALE',NULL),(3,7,5,'PRN252001','Kabir','Mehta','kabir.mehta@example.com','9876543212','MALE',NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` bigint NOT NULL AUTO_INCREMENT,
  `subject_code` varchar(50) NOT NULL,
  `subject_name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`),
  UNIQUE KEY `uq_subject_code` (`subject_code`),
  KEY `idx_subject_code` (`subject_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'COMM101','Effective Communication','2026-01-22 20:35:06','2026-01-22 20:35:06'),(2,'APT101','Aptitude','2026-01-22 20:35:06','2026-01-22 20:35:06'),(3,'ADS201','ADS Using Java','2026-01-22 20:35:06','2026-01-22 20:35:06'),(4,'CPP101','C++ Programming','2026-01-22 20:35:06','2026-01-22 20:35:06'),(5,'COS201','COSSDM – Concepts of Software Development Models','2026-01-22 20:35:06','2026-01-22 20:35:06'),(6,'COS202','COSSDM – Git and DevOps','2026-01-22 20:35:06','2026-01-22 20:35:06'),(7,'COS203','COSSDM – Software Design Models','2026-01-22 20:35:06','2026-01-22 20:35:06'),(8,'COS204','COSSDM – Software Testing','2026-01-22 20:35:06','2026-01-22 20:35:06'),(9,'DBT101','Database Technologies','2026-01-22 20:35:06','2026-01-22 20:35:06'),(10,'OOP201','Object-Oriented Programming with Java','2026-01-22 20:35:06','2026-01-22 20:35:06'),(11,'WEB301','Web Based Java Programming','2026-01-22 20:35:06','2026-01-22 20:35:06'),(12,'WEB101','Web Programming Technologies','2026-01-22 20:35:06','2026-01-22 20:35:06');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `submission_id` bigint NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint NOT NULL,
  `student_user_id` bigint NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size_bytes` bigint DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `remarks` text,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `status` enum('NOT_SUBMITTED','SUBMITTED','EVALUATED') NOT NULL DEFAULT 'NOT_SUBMITTED',
  PRIMARY KEY (`submission_id`),
  UNIQUE KEY `uq_assignment_student` (`assignment_id`,`student_user_id`),
  KEY `idx_assignment_id` (`assignment_id`),
  KEY `idx_student_user_id` (`student_user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_submissions_student_user` FOREIGN KEY (`student_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `submissions_chk_1` CHECK ((`grade` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (1,1,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED'),(2,2,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED'),(3,3,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED'),(4,4,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED'),(5,5,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED'),(6,6,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOT_SUBMITTED');
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_set_submitted_at` BEFORE UPDATE ON `submissions` FOR EACH ROW BEGIN
    IF
        OLD.status = 'NOT_SUBMITTED'
        AND NEW.status IN ('SUBMITTED', 'EVALUATED')
        AND NEW.submitted_at IS NULL
    THEN
        SET NEW.submitted_at = CURRENT_TIMESTAMP;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('STUDENT','FACULTY','ADMIN') NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_role_status` (`role`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','$2a$dummyhash6','ADMIN','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(2,'faculty1','$2a$dummyhash4','FACULTY','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(3,'faculty2','$2a$dummyhash5','FACULTY','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(4,'faculty3','$2a$dummyhash7','FACULTY','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(5,'student1','$2a$dummyhash1','STUDENT','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(6,'student2','$2a$dummyhash2','STUDENT','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(7,'student3','$2a$dummyhash3','STUDENT','ACTIVE','2026-01-22 20:35:06','2026-01-22 20:35:06'),(8,'old_user_01','$2a$dummyOldHash','STUDENT','INACTIVE','2025-05-22 20:35:06','2026-01-22 20:35:06'),(10,'admin_test_01','$2a$12$R/7ulhngKW28T/6KxrFzQ.rAC4ZA6WN4bbhW2RBzbYz6qHJdE1epy','ADMIN','ACTIVE','2026-01-23 09:33:43','2026-01-23 09:33:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'campusdb'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `ev_deactivate_old_students` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `ev_deactivate_old_students` ON SCHEDULE EVERY 7 DAY STARTS '2026-01-23 02:05:06' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE users
    SET status = 'INACTIVE'
    WHERE role = 'STUDENT'
      AND status = 'ACTIVE'
      AND created_at < (CURRENT_TIMESTAMP - INTERVAL 6 MONTH);
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'campusdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-24  2:08:08
