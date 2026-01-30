-- =====================================================
-- CORRECTED ADDITIONAL DATA INSERTION SCRIPT
-- =====================================================
-- This script inserts additional data into existing databases
-- Execute after the main schema creation script
-- Ensures no conflicts with existing data

-- =====================================================
-- DATABASE 1 - USERS_DB INSERTIONS
-- =====================================================
USE users_db;

-- =====================================================
-- INSERT ADDITIONAL FACULTY USERS (12 more to make 15 total)
-- Existing faculty user_ids: 2, 3, 4 (from original script)
-- New faculty user_ids will be: 8-19
-- =====================================================

INSERT INTO users (username, password_hash, role, status)
VALUES
('faculty4', '$2a$dummyhash8', 'FACULTY', 'ACTIVE'),
('faculty5', '$2a$dummyhash9', 'FACULTY', 'ACTIVE'),
('faculty6', '$2a$dummyhash10', 'FACULTY', 'ACTIVE'),
('faculty7', '$2a$dummyhash11', 'FACULTY', 'ACTIVE'),
('faculty8', '$2a$dummyhash12', 'FACULTY', 'ACTIVE'),
('faculty9', '$2a$dummyhash13', 'FACULTY', 'ACTIVE'),
('faculty10', '$2a$dummyhash14', 'FACULTY', 'ACTIVE'),
('faculty11', '$2a$dummyhash15', 'FACULTY', 'ACTIVE'),
('faculty12', '$2a$dummyhash16', 'FACULTY', 'ACTIVE'),
('faculty13', '$2a$dummyhash17', 'FACULTY', 'ACTIVE'),
('faculty14', '$2a$dummyhash18', 'FACULTY', 'ACTIVE'),
('faculty15', '$2a$dummyhash19', 'FACULTY', 'ACTIVE');

-- Insert faculty details (user_id will be 9-20 after the old_user_01 insertion)
INSERT INTO faculties (user_id, first_name, last_name, email, mobile, gender, profile_picture_url)
VALUES
(9, 'Rajesh', 'Kumar', 'rajesh.kumar@example.com', '9123456783', 'MALE', NULL),
(10, 'Priya', 'Deshmukh', 'priya.deshmukh@example.com', '9123456784', 'FEMALE', NULL),
(11, 'Amit', 'Joshi', 'amit.joshi@example.com', '9123456785', 'MALE', NULL),
(12, 'Sneha', 'Patil', 'sneha.patil@example.com', '9123456786', 'FEMALE', NULL),
(13, 'Kiran', 'Rao', 'kiran.rao@example.com', '9123456787', 'MALE', NULL),
(14, 'Meera', 'Kulkarni', 'meera.kulkarni@example.com', '9123456788', 'FEMALE', NULL),
(15, 'Suresh', 'Naik', 'suresh.naik@example.com', '9123456789', 'MALE', NULL),
(16, 'Anita', 'Bhosale', 'anita.bhosale@example.com', '9123456790', 'FEMALE', NULL),
(17, 'Deepak', 'Shinde', 'deepak.shinde@example.com', '9123456791', 'MALE', NULL),
(18, 'Kavita', 'Mane', 'kavita.mane@example.com', '9123456792', 'FEMALE', NULL),
(19, 'Nitin', 'Gaikwad', 'nitin.gaikwad@example.com', '9123456793', 'MALE', NULL),
(20, 'Pooja', 'Sawant', 'pooja.sawant@example.com', '9123456794', 'FEMALE', NULL);

-- =====================================================
-- INSERT STUDENT USERS (197 more to make 200 total)
-- Existing student user_ids: 5, 6, 7 (from original script)
-- New student user_ids will start from 21
-- =====================================================

INSERT INTO users (username, password_hash, role, status)
VALUES
('student4', '$2a$dummyhash20', 'STUDENT', 'ACTIVE'),
('student5', '$2a$dummyhash21', 'STUDENT', 'ACTIVE'),
('student6', '$2a$dummyhash22', 'STUDENT', 'ACTIVE'),
('student7', '$2a$dummyhash23', 'STUDENT', 'ACTIVE'),
('student8', '$2a$dummyhash24', 'STUDENT', 'ACTIVE'),
('student9', '$2a$dummyhash25', 'STUDENT', 'ACTIVE'),
('student10', '$2a$dummyhash26', 'STUDENT', 'ACTIVE'),
('student11', '$2a$dummyhash27', 'STUDENT', 'ACTIVE'),
('student12', '$2a$dummyhash28', 'STUDENT', 'ACTIVE'),
('student13', '$2a$dummyhash29', 'STUDENT', 'ACTIVE'),
('student14', '$2a$dummyhash30', 'STUDENT', 'ACTIVE'),
('student15', '$2a$dummyhash31', 'STUDENT', 'ACTIVE'),
('student16', '$2a$dummyhash32', 'STUDENT', 'ACTIVE'),
('student17', '$2a$dummyhash33', 'STUDENT', 'ACTIVE'),
('student18', '$2a$dummyhash34', 'STUDENT', 'ACTIVE'),
('student19', '$2a$dummyhash35', 'STUDENT', 'ACTIVE'),
('student20', '$2a$dummyhash36', 'STUDENT', 'ACTIVE'),
('student21', '$2a$dummyhash37', 'STUDENT', 'ACTIVE'),
('student22', '$2a$dummyhash38', 'STUDENT', 'ACTIVE'),
('student23', '$2a$dummyhash39', 'STUDENT', 'ACTIVE'),
('student24', '$2a$dummyhash40', 'STUDENT', 'ACTIVE'),
('student25', '$2a$dummyhash41', 'STUDENT', 'ACTIVE'),
('student26', '$2a$dummyhash42', 'STUDENT', 'ACTIVE'),
('student27', '$2a$dummyhash43', 'STUDENT', 'ACTIVE'),
('student28', '$2a$dummyhash44', 'STUDENT', 'ACTIVE'),
('student29', '$2a$dummyhash45', 'STUDENT', 'ACTIVE'),
('student30', '$2a$dummyhash46', 'STUDENT', 'ACTIVE'),
('student31', '$2a$dummyhash47', 'STUDENT', 'ACTIVE'),
('student32', '$2a$dummyhash48', 'STUDENT', 'ACTIVE'),
('student33', '$2a$dummyhash49', 'STUDENT', 'ACTIVE'),
('student34', '$2a$dummyhash50', 'STUDENT', 'ACTIVE'),
('student35', '$2a$dummyhash51', 'STUDENT', 'ACTIVE'),
('student36', '$2a$dummyhash52', 'STUDENT', 'ACTIVE'),
('student37', '$2a$dummyhash53', 'STUDENT', 'ACTIVE'),
('student38', '$2a$dummyhash54', 'STUDENT', 'ACTIVE'),
('student39', '$2a$dummyhash55', 'STUDENT', 'ACTIVE'),
('student40', '$2a$dummyhash56', 'STUDENT', 'ACTIVE'),
('student41', '$2a$dummyhash57', 'STUDENT', 'ACTIVE'),
('student42', '$2a$dummyhash58', 'STUDENT', 'ACTIVE'),
('student43', '$2a$dummyhash59', 'STUDENT', 'ACTIVE'),
('student44', '$2a$dummyhash60', 'STUDENT', 'ACTIVE'),
('student45', '$2a$dummyhash61', 'STUDENT', 'ACTIVE'),
('student46', '$2a$dummyhash62', 'STUDENT', 'ACTIVE'),
('student47', '$2a$dummyhash63', 'STUDENT', 'ACTIVE'),
('student48', '$2a$dummyhash64', 'STUDENT', 'ACTIVE'),
('student49', '$2a$dummyhash65', 'STUDENT', 'ACTIVE'),
('student50', '$2a$dummyhash66', 'STUDENT', 'ACTIVE'),
('student51', '$2a$dummyhash67', 'STUDENT', 'ACTIVE'),
('student52', '$2a$dummyhash68', 'STUDENT', 'ACTIVE'),
('student53', '$2a$dummyhash69', 'STUDENT', 'ACTIVE'),
('student54', '$2a$dummyhash70', 'STUDENT', 'ACTIVE'),
('student55', '$2a$dummyhash71', 'STUDENT', 'ACTIVE'),
('student56', '$2a$dummyhash72', 'STUDENT', 'ACTIVE'),
('student57', '$2a$dummyhash73', 'STUDENT', 'ACTIVE'),
('student58', '$2a$dummyhash74', 'STUDENT', 'ACTIVE'),
('student59', '$2a$dummyhash75', 'STUDENT', 'ACTIVE'),
('student60', '$2a$dummyhash76', 'STUDENT', 'ACTIVE'),
('student61', '$2a$dummyhash77', 'STUDENT', 'ACTIVE'),
('student62', '$2a$dummyhash78', 'STUDENT', 'ACTIVE'),
('student63', '$2a$dummyhash79', 'STUDENT', 'ACTIVE'),
('student64', '$2a$dummyhash80', 'STUDENT', 'ACTIVE'),
('student65', '$2a$dummyhash81', 'STUDENT', 'ACTIVE'),
('student66', '$2a$dummyhash82', 'STUDENT', 'ACTIVE'),
('student67', '$2a$dummyhash83', 'STUDENT', 'ACTIVE'),
('student68', '$2a$dummyhash84', 'STUDENT', 'ACTIVE'),
('student69', '$2a$dummyhash85', 'STUDENT', 'ACTIVE'),
('student70', '$2a$dummyhash86', 'STUDENT', 'ACTIVE'),
('student71', '$2a$dummyhash87', 'STUDENT', 'ACTIVE'),
('student72', '$2a$dummyhash88', 'STUDENT', 'ACTIVE'),
('student73', '$2a$dummyhash89', 'STUDENT', 'ACTIVE'),
('student74', '$2a$dummyhash90', 'STUDENT', 'ACTIVE'),
('student75', '$2a$dummyhash91', 'STUDENT', 'ACTIVE'),
('student76', '$2a$dummyhash92', 'STUDENT', 'ACTIVE'),
('student77', '$2a$dummyhash93', 'STUDENT', 'ACTIVE'),
('student78', '$2a$dummyhash94', 'STUDENT', 'ACTIVE'),
('student79', '$2a$dummyhash95', 'STUDENT', 'ACTIVE'),
('student80', '$2a$dummyhash96', 'STUDENT', 'ACTIVE'),
('student81', '$2a$dummyhash97', 'STUDENT', 'ACTIVE'),
('student82', '$2a$dummyhash98', 'STUDENT', 'ACTIVE'),
('student83', '$2a$dummyhash99', 'STUDENT', 'ACTIVE'),
('student84', '$2a$dummyhash100', 'STUDENT', 'ACTIVE'),
('student85', '$2a$dummyhash101', 'STUDENT', 'ACTIVE'),
('student86', '$2a$dummyhash102', 'STUDENT', 'ACTIVE'),
('student87', '$2a$dummyhash103', 'STUDENT', 'ACTIVE'),
('student88', '$2a$dummyhash104', 'STUDENT', 'ACTIVE'),
('student89', '$2a$dummyhash105', 'STUDENT', 'ACTIVE'),
('student90', '$2a$dummyhash106', 'STUDENT', 'ACTIVE'),
('student91', '$2a$dummyhash107', 'STUDENT', 'ACTIVE'),
('student92', '$2a$dummyhash108', 'STUDENT', 'ACTIVE'),
('student93', '$2a$dummyhash109', 'STUDENT', 'ACTIVE'),
('student94', '$2a$dummyhash110', 'STUDENT', 'ACTIVE'),
('student95', '$2a$dummyhash111', 'STUDENT', 'ACTIVE'),
('student96', '$2a$dummyhash112', 'STUDENT', 'ACTIVE'),
('student97', '$2a$dummyhash113', 'STUDENT', 'ACTIVE'),
('student98', '$2a$dummyhash114', 'STUDENT', 'ACTIVE'),
('student99', '$2a$dummyhash115', 'STUDENT', 'ACTIVE'),
('student100', '$2a$dummyhash116', 'STUDENT', 'ACTIVE'),
('student101', '$2a$dummyhash117', 'STUDENT', 'ACTIVE'),
('student102', '$2a$dummyhash118', 'STUDENT', 'ACTIVE'),
('student103', '$2a$dummyhash119', 'STUDENT', 'ACTIVE'),
('student104', '$2a$dummyhash120', 'STUDENT', 'ACTIVE'),
('student105', '$2a$dummyhash121', 'STUDENT', 'ACTIVE'),
('student106', '$2a$dummyhash122', 'STUDENT', 'ACTIVE'),
('student107', '$2a$dummyhash123', 'STUDENT', 'ACTIVE'),
('student108', '$2a$dummyhash124', 'STUDENT', 'ACTIVE'),
('student109', '$2a$dummyhash125', 'STUDENT', 'ACTIVE'),
('student110', '$2a$dummyhash126', 'STUDENT', 'ACTIVE'),
('student111', '$2a$dummyhash127', 'STUDENT', 'ACTIVE'),
('student112', '$2a$dummyhash128', 'STUDENT', 'ACTIVE'),
('student113', '$2a$dummyhash129', 'STUDENT', 'ACTIVE'),
('student114', '$2a$dummyhash130', 'STUDENT', 'ACTIVE'),
('student115', '$2a$dummyhash131', 'STUDENT', 'ACTIVE'),
('student116', '$2a$dummyhash132', 'STUDENT', 'ACTIVE'),
('student117', '$2a$dummyhash133', 'STUDENT', 'ACTIVE'),
('student118', '$2a$dummyhash134', 'STUDENT', 'ACTIVE'),
('student119', '$2a$dummyhash135', 'STUDENT', 'ACTIVE'),
('student120', '$2a$dummyhash136', 'STUDENT', 'ACTIVE'),
('student121', '$2a$dummyhash137', 'STUDENT', 'ACTIVE'),
('student122', '$2a$dummyhash138', 'STUDENT', 'ACTIVE'),
('student123', '$2a$dummyhash139', 'STUDENT', 'ACTIVE'),
('student124', '$2a$dummyhash140', 'STUDENT', 'ACTIVE'),
('student125', '$2a$dummyhash141', 'STUDENT', 'ACTIVE'),
('student126', '$2a$dummyhash142', 'STUDENT', 'ACTIVE'),
('student127', '$2a$dummyhash143', 'STUDENT', 'ACTIVE'),
('student128', '$2a$dummyhash144', 'STUDENT', 'ACTIVE'),
('student129', '$2a$dummyhash145', 'STUDENT', 'ACTIVE'),
('student130', '$2a$dummyhash146', 'STUDENT', 'ACTIVE'),
('student131', '$2a$dummyhash147', 'STUDENT', 'ACTIVE'),
('student132', '$2a$dummyhash148', 'STUDENT', 'ACTIVE'),
('student133', '$2a$dummyhash149', 'STUDENT', 'ACTIVE'),
('student134', '$2a$dummyhash150', 'STUDENT', 'ACTIVE'),
('student135', '$2a$dummyhash151', 'STUDENT', 'ACTIVE'),
('student136', '$2a$dummyhash152', 'STUDENT', 'ACTIVE'),
('student137', '$2a$dummyhash153', 'STUDENT', 'ACTIVE'),
('student138', '$2a$dummyhash154', 'STUDENT', 'ACTIVE'),
('student139', '$2a$dummyhash155', 'STUDENT', 'ACTIVE'),
('student140', '$2a$dummyhash156', 'STUDENT', 'ACTIVE'),
('student141', '$2a$dummyhash157', 'STUDENT', 'ACTIVE'),
('student142', '$2a$dummyhash158', 'STUDENT', 'ACTIVE'),
('student143', '$2a$dummyhash159', 'STUDENT', 'ACTIVE'),
('student144', '$2a$dummyhash160', 'STUDENT', 'ACTIVE'),
('student145', '$2a$dummyhash161', 'STUDENT', 'ACTIVE'),
('student146', '$2a$dummyhash162', 'STUDENT', 'ACTIVE'),
('student147', '$2a$dummyhash163', 'STUDENT', 'ACTIVE'),
('student148', '$2a$dummyhash164', 'STUDENT', 'ACTIVE'),
('student149', '$2a$dummyhash165', 'STUDENT', 'ACTIVE'),
('student150', '$2a$dummyhash166', 'STUDENT', 'ACTIVE'),
('student151', '$2a$dummyhash167', 'STUDENT', 'ACTIVE'),
('student152', '$2a$dummyhash168', 'STUDENT', 'ACTIVE'),
('student153', '$2a$dummyhash169', 'STUDENT', 'ACTIVE'),
('student154', '$2a$dummyhash170', 'STUDENT', 'ACTIVE'),
('student155', '$2a$dummyhash171', 'STUDENT', 'ACTIVE'),
('student156', '$2a$dummyhash172', 'STUDENT', 'ACTIVE'),
('student157', '$2a$dummyhash173', 'STUDENT', 'ACTIVE'),
('student158', '$2a$dummyhash174', 'STUDENT', 'ACTIVE'),
('student159', '$2a$dummyhash175', 'STUDENT', 'ACTIVE'),
('student160', '$2a$dummyhash176', 'STUDENT', 'ACTIVE'),
('student161', '$2a$dummyhash177', 'STUDENT', 'ACTIVE'),
('student162', '$2a$dummyhash178', 'STUDENT', 'ACTIVE'),
('student163', '$2a$dummyhash179', 'STUDENT', 'ACTIVE'),
('student164', '$2a$dummyhash180', 'STUDENT', 'ACTIVE'),
('student165', '$2a$dummyhash181', 'STUDENT', 'ACTIVE'),
('student166', '$2a$dummyhash182', 'STUDENT', 'ACTIVE'),
('student167', '$2a$dummyhash183', 'STUDENT', 'ACTIVE'),
('student168', '$2a$dummyhash184', 'STUDENT', 'ACTIVE'),
('student169', '$2a$dummyhash185', 'STUDENT', 'ACTIVE'),
('student170', '$2a$dummyhash186', 'STUDENT', 'ACTIVE'),
('student171', '$2a$dummyhash187', 'STUDENT', 'ACTIVE'),
('student172', '$2a$dummyhash188', 'STUDENT', 'ACTIVE'),
('student173', '$2a$dummyhash189', 'STUDENT', 'ACTIVE'),
('student174', '$2a$dummyhash190', 'STUDENT', 'ACTIVE'),
('student175', '$2a$dummyhash191', 'STUDENT', 'ACTIVE'),
('student176', '$2a$dummyhash192', 'STUDENT', 'ACTIVE'),
('student177', '$2a$dummyhash193', 'STUDENT', 'ACTIVE'),
('student178', '$2a$dummyhash194', 'STUDENT', 'ACTIVE'),
('student179', '$2a$dummyhash195', 'STUDENT', 'ACTIVE'),
('student180', '$2a$dummyhash196', 'STUDENT', 'ACTIVE'),
('student181', '$2a$dummyhash197', 'STUDENT', 'ACTIVE'),
('student182', '$2a$dummyhash198', 'STUDENT', 'ACTIVE'),
('student183', '$2a$dummyhash199', 'STUDENT', 'ACTIVE'),
('student184', '$2a$dummyhash200', 'STUDENT', 'ACTIVE'),
('student185', '$2a$dummyhash201', 'STUDENT', 'ACTIVE'),
('student186', '$2a$dummyhash202', 'STUDENT', 'ACTIVE'),
('student187', '$2a$dummyhash203', 'STUDENT', 'ACTIVE'),
('student188', '$2a$dummyhash204', 'STUDENT', 'ACTIVE'),
('student189', '$2a$dummyhash205', 'STUDENT', 'ACTIVE'),
('student190', '$2a$dummyhash206', 'STUDENT', 'ACTIVE'),
('student191', '$2a$dummyhash207', 'STUDENT', 'ACTIVE'),
('student192', '$2a$dummyhash208', 'STUDENT', 'ACTIVE'),
('student193', '$2a$dummyhash209', 'STUDENT', 'ACTIVE'),
('student194', '$2a$dummyhash210', 'STUDENT', 'ACTIVE'),
('student195', '$2a$dummyhash211', 'STUDENT', 'ACTIVE'),
('student196', '$2a$dummyhash212', 'STUDENT', 'ACTIVE'),
('student197', '$2a$dummyhash213', 'STUDENT', 'ACTIVE'),
('student198', '$2a$dummyhash214', 'STUDENT', 'ACTIVE'),
('student199', '$2a$dummyhash215', 'STUDENT', 'ACTIVE'),
('student200', '$2a$dummyhash216', 'STUDENT', 'ACTIVE');

-- =====================================================
-- DATABASE 2 - ACADEMIC_DB INSERTIONS
-- =====================================================
USE academic_db;

-- =====================================================
-- INSERT ADDITIONAL BATCHES (4 more to make 6 total)
-- Existing batches: 251 (FEB_2025), 252 (AUG_2025)
-- =====================================================

INSERT INTO batches (batch_id, batch_name, start_date, end_date, status, description)
VALUES
(241, 'FEB_2024', '2024-02-04', '2024-08-22', 'COMPLETED', 'February 2024 batch'),
(242, 'AUG_2024', '2024-08-22', '2025-02-04', 'COMPLETED', 'August 2024 batch'),
(261, 'FEB_2026', '2026-02-04', '2026-08-22', 'UPCOMING', 'February 2026 batch'),
(262, 'AUG_2026', '2026-08-22', '2027-02-04', 'UPCOMING', 'August 2026 batch');

-- =====================================================
-- INSERT ADDITIONAL COURSES (2 more)
-- Existing courses: 1-4 (PG-DAC, PG-DBDA, PG-DTSS, PG-DAI)
-- =====================================================

INSERT INTO courses (course_code, course_name, duration_months, status)
VALUES
('PG-DVLSI', 'PG Diploma in VLSI Design', 6, 'ACTIVE'),
('PG-DESD', 'PG Diploma in Embedded Systems Design', 6, 'ACTIVE');

-- =====================================================
-- INSERT ADDITIONAL SUBJECTS
-- Existing subjects: 1-12
-- =====================================================

INSERT INTO subjects (subject_code, subject_name)
VALUES
-- PG-DAC Subjects (beyond existing ones)
('ADS101', 'Data Structures & Algorithms'),
('COS101', 'COSSDM - Operating Systems'),
('COS301', 'COSSDM - Software Engineering'),
('COS401', 'COSSDM - DevOps'),
('COS501', 'COSSDM - Testing'),
('.NET101', 'Microsoft .NET'),

-- PG-DBDA Subjects
('PY101', 'Python Programming'),
('STAT101', 'Statistics & Probability'),
('SQL101', 'SQL & NoSQL Databases'),
('HADOOP101', 'Hadoop Ecosystem'),
('SPARK101', 'Apache Spark'),
('DW101', 'Data Warehousing'),
('DM101', 'Data Mining'),
('ML101', 'Machine Learning'),
('DV101', 'Data Visualization'),

-- PG-DAI Subjects
('PY201', 'Python Programming for AI'),
('STAT201', 'Statistics & Linear Algebra'),
('ML201', 'Machine Learning Fundamentals'),
('DL101', 'Deep Learning'),
('NN101', 'Neural Networks'),
('NLP101', 'Natural Language Processing'),
('CV101', 'Computer Vision'),
('RL101', 'Reinforcement Learning'),
('MLOPS101', 'MLOps Basics'),

-- PG-DVLSI Subjects
('DE101', 'Digital Electronics'),
('CMOS101', 'CMOS Technology'),
('VLOG101', 'Verilog HDL'),
('SYSV101', 'SystemVerilog'),
('VLSI101', 'VLSI Design Flow'),
('ASIC101', 'ASIC Design'),
('FPGA101', 'FPGA Design'),
('PD101', 'Physical Design'),
('STA101', 'Static Timing Analysis'),

-- PG-DESD Subjects
('CPROG101', 'C Programming'),
('EMBC101', 'Embedded C'),
('MC101', 'Microcontrollers'),
('ARM101', 'ARM Architecture'),
('DE201', 'Digital Electronics for Embedded'),
('RTOS101', 'RTOS'),
('LINUX101', 'Embedded Linux'),
('DD101', 'Device Drivers'),
('COMM_PROT101', 'Communication Protocols');

-- =====================================================
-- INSERT BATCH_COURSES
-- Existing batch_courses: 8 entries (batch_course_id 1-8)
-- =====================================================

-- FEB_2024 batch (batch_id = 241) -> batch_course_id will be 9-12
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(241, 1, '2024-02-04', '2024-08-22'), -- PG-DAC
(241, 2, '2024-02-04', '2024-08-22'), -- PG-DBDA
(241, 5, '2024-02-04', '2024-08-22'), -- PG-DVLSI
(241, 6, '2024-02-04', '2024-08-22'); -- PG-DESD

-- AUG_2024 batch (batch_id = 242) -> batch_course_id will be 13-16
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(242, 1, '2024-08-22', '2025-02-04'), -- PG-DAC
(242, 2, '2024-08-22', '2025-02-04'), -- PG-DBDA
(242, 5, '2024-08-22', '2025-02-04'), -- PG-DVLSI
(242, 6, '2024-08-22', '2025-02-04'); -- PG-DESD

-- FEB_2025 batch (batch_id = 251) - Additional courses -> batch_course_id will be 17-18
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(251, 5, '2025-02-04', '2025-08-22'), -- PG-DVLSI
(251, 6, '2025-02-04', '2025-08-22'); -- PG-DESD

-- AUG_2025 batch (batch_id = 252) - Additional courses -> batch_course_id will be 19-20
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(252, 5, '2025-08-22', '2026-02-04'), -- PG-DVLSI
(252, 6, '2025-08-22', '2026-02-04'); -- PG-DESD

-- FEB_2026 batch (batch_id = 261) -> batch_course_id will be 21-25
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(261, 1, '2026-02-04', '2026-08-22'), -- PG-DAC
(261, 2, '2026-02-04', '2026-08-22'), -- PG-DBDA
(261, 4, '2026-02-04', '2026-08-22'), -- PG-DAI
(261, 5, '2026-02-04', '2026-08-22'), -- PG-DVLSI
(261, 6, '2026-02-04', '2026-08-22'); -- PG-DESD

-- AUG_2026 batch (batch_id = 262) -> batch_course_id will be 26-30
INSERT INTO batch_courses (batch_id, course_id, start_date, end_date)
VALUES
(262, 1, '2026-08-22', '2027-02-04'), -- PG-DAC
(262, 2, '2026-08-22', '2027-02-04'), -- PG-DBDA
(262, 4, '2026-08-22', '2027-02-04'), -- PG-DAI
(262, 5, '2026-08-22', '2027-02-04'), -- PG-DVLSI
(262, 6, '2026-08-22', '2027-02-04'); -- PG-DESD

-- =====================================================
-- INSERT BATCH_COURSE_SUBJECTS
-- Existing batch_course_subjects: 10 entries (batch_course_subject_id 1-10)
-- =====================================================

-- FEB_2024 Batch: batch_course_id 9-12
-- BC_ID 9: FEB_2024 PG-DAC
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(9, 4),   -- C++ Programming
(9, 13),  -- Data Structures & Algorithms
(9, 10),  -- Object Oriented Programming with Java
(9, 11),  -- Web Based Java Programming
(9, 12),  -- Web Programming Technologies
(9, 9),   -- Database Technologies
(9, 14),  -- COSSDM - Operating Systems
(9, 15),  -- COSSDM - Software Engineering
(9, 16),  -- COSSDM - DevOps
(9, 17),  -- COSSDM - Testing
(9, 18);  -- Microsoft .NET

-- BC_ID 10: FEB_2024 PG-DBDA
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(10, 19), -- Python Programming
(10, 20), -- Statistics & Probability
(10, 21), -- SQL & NoSQL Databases
(10, 22), -- Hadoop Ecosystem
(10, 23), -- Apache Spark
(10, 24), -- Data Warehousing
(10, 25), -- Data Mining
(10, 26), -- Machine Learning
(10, 27); -- Data Visualization

-- BC_ID 11: FEB_2024 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(11, 37), -- Digital Electronics
(11, 38), -- CMOS Technology
(11, 39), -- Verilog HDL
(11, 40), -- SystemVerilog
(11, 41), -- VLSI Design Flow
(11, 42), -- ASIC Design
(11, 43), -- FPGA Design
(11, 44), -- Physical Design
(11, 45); -- Static Timing Analysis

-- BC_ID 12: FEB_2024 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(12, 46), -- C Programming
(12, 47), -- Embedded C
(12, 48), -- Microcontrollers
(12, 49), -- ARM Architecture
(12, 50), -- Digital Electronics for Embedded
(12, 51), -- RTOS
(12, 52), -- Embedded Linux
(12, 53), -- Device Drivers
(12, 54); -- Communication Protocols

-- AUG_2024 Batch: batch_course_id 13-16
-- BC_ID 13: AUG_2024 PG-DAC
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(13, 4),   -- C++ Programming
(13, 13),  -- Data Structures & Algorithms
(13, 10),  -- Object Oriented Programming with Java
(13, 11),  -- Web Based Java Programming
(13, 12),  -- Web Programming Technologies
(13, 9),   -- Database Technologies
(13, 14),  -- COSSDM - Operating Systems
(13, 15),  -- COSSDM - Software Engineering
(13, 16),  -- COSSDM - DevOps
(13, 17),  -- COSSDM - Testing
(13, 18);  -- Microsoft .NET

-- BC_ID 14: AUG_2024 PG-DBDA
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(14, 19), -- Python Programming
(14, 20), -- Statistics & Probability
(14, 21), -- SQL & NoSQL Databases
(14, 22), -- Hadoop Ecosystem
(14, 23), -- Apache Spark
(14, 24), -- Data Warehousing
(14, 25), -- Data Mining
(14, 26), -- Machine Learning
(14, 27); -- Data Visualization

-- BC_ID 15: AUG_2024 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(15, 37), -- Digital Electronics
(15, 38), -- CMOS Technology
(15, 39), -- Verilog HDL
(15, 40), -- SystemVerilog
(15, 41), -- VLSI Design Flow
(15, 42), -- ASIC Design
(15, 43), -- FPGA Design
(15, 44), -- Physical Design
(15, 45); -- Static Timing Analysis

-- BC_ID 16: AUG_2024 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(16, 46), -- C Programming
(16, 47), -- Embedded C
(16, 48), -- Microcontrollers
(16, 49), -- ARM Architecture
(16, 50), -- Digital Electronics for Embedded
(16, 51), -- RTOS
(16, 52), -- Embedded Linux
(16, 53), -- Device Drivers
(16, 54); -- Communication Protocols

-- FEB_2025 Batch: batch_course_id 17-18
-- BC_ID 17: FEB_2025 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(17, 37), -- Digital Electronics
(17, 38), -- CMOS Technology
(17, 39), -- Verilog HDL
(17, 40), -- SystemVerilog
(17, 41), -- VLSI Design Flow
(17, 42), -- ASIC Design
(17, 43), -- FPGA Design
(17, 44), -- Physical Design
(17, 45); -- Static Timing Analysis

-- BC_ID 18: FEB_2025 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(18, 46), -- C Programming
(18, 47), -- Embedded C
(18, 48), -- Microcontrollers
(18, 49), -- ARM Architecture
(18, 50), -- Digital Electronics for Embedded
(18, 51), -- RTOS
(18, 52), -- Embedded Linux
(18, 53), -- Device Drivers
(18, 54); -- Communication Protocols

-- AUG_2025 Batch: batch_course_id 19-20
-- BC_ID 19: AUG_2025 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(19, 37), -- Digital Electronics
(19, 38), -- CMOS Technology
(19, 39), -- Verilog HDL
(19, 40), -- SystemVerilog
(19, 41), -- VLSI Design Flow
(19, 42), -- ASIC Design
(19, 43), -- FPGA Design
(19, 44), -- Physical Design
(19, 45); -- Static Timing Analysis

-- BC_ID 20: AUG_2025 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(20, 46), -- C Programming
(20, 47), -- Embedded C
(20, 48), -- Microcontrollers
(20, 49), -- ARM Architecture
(20, 50), -- Digital Electronics for Embedded
(20, 51), -- RTOS
(20, 52), -- Embedded Linux
(20, 53), -- Device Drivers
(20, 54); -- Communication Protocols

-- FEB_2026 Batch: batch_course_id 21-25
-- BC_ID 21: FEB_2026 PG-DAC
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(21, 4),   -- C++ Programming
(21, 13),  -- Data Structures & Algorithms
(21, 10),  -- Object Oriented Programming with Java
(21, 11),  -- Web Based Java Programming
(21, 12),  -- Web Programming Technologies
(21, 9),   -- Database Technologies
(21, 14),  -- COSSDM - Operating Systems
(21, 15),  -- COSSDM - Software Engineering
(21, 16),  -- COSSDM - DevOps
(21, 17),  -- COSSDM - Testing
(21, 18);  -- Microsoft .NET

-- BC_ID 22: FEB_2026 PG-DBDA
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(22, 19), -- Python Programming
(22, 20), -- Statistics & Probability
(22, 21), -- SQL & NoSQL Databases
(22, 22), -- Hadoop Ecosystem
(22, 23), -- Apache Spark
(22, 24), -- Data Warehousing
(22, 25), -- Data Mining
(22, 26), -- Machine Learning
(22, 27); -- Data Visualization

-- BC_ID 23: FEB_2026 PG-DAI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(23, 28), -- Python Programming for AI
(23, 29), -- Statistics & Linear Algebra
(23, 30), -- Machine Learning Fundamentals
(23, 31), -- Deep Learning
(23, 32), -- Neural Networks
(23, 33), -- Natural Language Processing
(23, 34), -- Computer Vision
(23, 35), -- Reinforcement Learning
(23, 36); -- MLOps Basics

-- BC_ID 24: FEB_2026 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(24, 37), -- Digital Electronics
(24, 38), -- CMOS Technology
(24, 39), -- Verilog HDL
(24, 40), -- SystemVerilog
(24, 41), -- VLSI Design Flow
(24, 42), -- ASIC Design
(24, 43), -- FPGA Design
(24, 44), -- Physical Design
(24, 45); -- Static Timing Analysis

-- BC_ID 25: FEB_2026 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(25, 46), -- C Programming
(25, 47), -- Embedded C
(25, 48), -- Microcontrollers
(25, 49), -- ARM Architecture
(25, 50), -- Digital Electronics for Embedded
(25, 51), -- RTOS
(25, 52), -- Embedded Linux
(25, 53), -- Device Drivers
(25, 54); -- Communication Protocols

-- AUG_2026 Batch: batch_course_id 26-30
-- BC_ID 26: AUG_2026 PG-DAC
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(26, 4),   -- C++ Programming
(26, 13),  -- Data Structures & Algorithms
(26, 10),  -- Object Oriented Programming with Java
(26, 11),  -- Web Based Java Programming
(26, 12),  -- Web Programming Technologies
(26, 9),   -- Database Technologies
(26, 14),  -- COSSDM - Operating Systems
(26, 15),  -- COSSDM - Software Engineering
(26, 16),  -- COSSDM - DevOps
(26, 17),  -- COSSDM - Testing
(26, 18);  -- Microsoft .NET

-- BC_ID 27: AUG_2026 PG-DBDA
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(27, 19), -- Python Programming
(27, 20), -- Statistics & Probability
(27, 21), -- SQL & NoSQL Databases
(27, 22), -- Hadoop Ecosystem
(27, 23), -- Apache Spark
(27, 24), -- Data Warehousing
(27, 25), -- Data Mining
(27, 26), -- Machine Learning
(27, 27); -- Data Visualization

-- BC_ID 28: AUG_2026 PG-DAI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(28, 28), -- Python Programming for AI
(28, 29), -- Statistics & Linear Algebra
(28, 30), -- Machine Learning Fundamentals
(28, 31), -- Deep Learning
(28, 32), -- Neural Networks
(28, 33), -- Natural Language Processing
(28, 34), -- Computer Vision
(28, 35), -- Reinforcement Learning
(28, 36); -- MLOps Basics

-- BC_ID 29: AUG_2026 PG-DVLSI
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(29, 37), -- Digital Electronics
(29, 38), -- CMOS Technology
(29, 39), -- Verilog HDL
(29, 40), -- SystemVerilog
(29, 41), -- VLSI Design Flow
(29, 42), -- ASIC Design
(29, 43), -- FPGA Design
(29, 44), -- Physical Design
(29, 45); -- Static Timing Analysis

-- BC_ID 30: AUG_2026 PG-DESD
INSERT INTO batch_course_subjects (batch_course_id, subject_id)
VALUES
(30, 46), -- C Programming
(30, 47), -- Embedded C
(30, 48), -- Microcontrollers
(30, 49), -- ARM Architecture
(30, 50), -- Digital Electronics for Embedded
(30, 51), -- RTOS
(30, 52), -- Embedded Linux
(30, 53), -- Device Drivers
(30, 54); -- Communication Protocols

-- =====================================================
-- INSERT STUDENTS INTO users_db.students
-- Note: Original script has student table WITHOUT batch_course_id column
-- Students are linked to batch_courses through academic_db.student_enrollments
-- =====================================================

USE users_db;

-- Insert 197 additional student records (existing: 3)
-- user_ids will start from 21 (after faculty users 9-20)
INSERT INTO students (user_id, prn, first_name, last_name, email, mobile, gender, profile_picture_url)
VALUES
-- FEB_2024 PG-DAC students (10 students)
(21, 'PRN241001', 'Arjun', 'Verma', 'arjun.verma@example.com', '9801234560', 'MALE', NULL),
(22, 'PRN241002', 'Priya', 'Singh', 'priya.singh@example.com', '9801234561', 'FEMALE', NULL),
(23, 'PRN241003', 'Rahul', 'Gupta', 'rahul.gupta@example.com', '9801234562', 'MALE', NULL),
(24, 'PRN241004', 'Sneha', 'Reddy', 'sneha.reddy@example.com', '9801234563', 'FEMALE', NULL),
(25, 'PRN241005', 'Vikram', 'Jain', 'vikram.jain@example.com', '9801234564', 'MALE', NULL),
(26, 'PRN241006', 'Anjali', 'Nair', 'anjali.nair@example.com', '9801234565', 'FEMALE', NULL),
(27, 'PRN241007', 'Karthik', 'Rao', 'karthik.rao@example.com', '9801234566', 'MALE', NULL),
(28, 'PRN241008', 'Divya', 'Iyer', 'divya.iyer@example.com', '9801234567', 'FEMALE', NULL),
(29, 'PRN241009', 'Aditya', 'Menon', 'aditya.menon@example.com', '9801234568', 'MALE', NULL),
(30, 'PRN241010', 'Pooja', 'Agarwal', 'pooja.agarwal@example.com', '9801234569', 'FEMALE', NULL),

-- FEB_2024 PG-DBDA students (10 students)
(31, 'PRN241011', 'Sanjay', 'Mishra', 'sanjay.mishra@example.com', '9801234570', 'MALE', NULL),
(32, 'PRN241012', 'Nisha', 'Kapoor', 'nisha.kapoor@example.com', '9801234571', 'FEMALE', NULL),
(33, 'PRN241013', 'Rohan', 'Das', 'rohan.das@example.com', '9801234572', 'MALE', NULL),
(34, 'PRN241014', 'Kavya', 'Pillai', 'kavya.pillai@example.com', '9801234573', 'FEMALE', NULL),
(35, 'PRN241015', 'Manish', 'Dubey', 'manish.dubey@example.com', '9801234574', 'MALE', NULL),
(36, 'PRN241016', 'Swati', 'Bhatt', 'swati.bhatt@example.com', '9801234575', 'FEMALE', NULL),
(37, 'PRN241017', 'Harish', 'Pandey', 'harish.pandey@example.com', '9801234576', 'MALE', NULL),
(38, 'PRN241018', 'Tanvi', 'Saxena', 'tanvi.saxena@example.com', '9801234577', 'FEMALE', NULL),
(39, 'PRN241019', 'Nikhil', 'Chopra', 'nikhil.chopra@example.com', '9801234578', 'MALE', NULL),
(40, 'PRN241020', 'Megha', 'Malhotra', 'megha.malhotra@example.com', '9801234579', 'FEMALE', NULL),

-- FEB_2024 PG-DVLSI students (10 students)
(41, 'PRN241021', 'Sunil', 'Tiwari', 'sunil.tiwari@example.com', '9801234580', 'MALE', NULL),
(42, 'PRN241022', 'Ritika', 'Bajaj', 'ritika.bajaj@example.com', '9801234581', 'FEMALE', NULL),
(43, 'PRN241023', 'Varun', 'Singhal', 'varun.singhal@example.com', '9801234582', 'MALE', NULL),
(44, 'PRN241024', 'Ishita', 'Bansal', 'ishita.bansal@example.com', '9801234583', 'FEMALE', NULL),
(45, 'PRN241025', 'Gaurav', 'Thakur', 'gaurav.thakur@example.com', '9801234584', 'MALE', NULL),
(46, 'PRN241026', 'Ritu', 'Goyal', 'ritu.goyal@example.com', '9801234585', 'FEMALE', NULL),
(47, 'PRN241027', 'Siddharth', 'Sinha', 'siddharth.sinha@example.com', '9801234586', 'MALE', NULL),
(48, 'PRN241028', 'Pallavi', 'Chawla', 'pallavi.chawla@example.com', '9801234587', 'FEMALE', NULL),
(49, 'PRN241029', 'Akash', 'Bhatia', 'akash.bhatia@example.com', '9801234588', 'MALE', NULL),
(50, 'PRN241030', 'Shruti', 'Sethi', 'shruti.sethi@example.com', '9801234589', 'FEMALE', NULL),

-- FEB_2024 PG-DESD students (10 students)
(51, 'PRN241031', 'Deepak', 'Kohli', 'deepak.kohli@example.com', '9801234590', 'MALE', NULL),
(52, 'PRN241032', 'Seema', 'Arora', 'seema.arora@example.com', '9801234591', 'FEMALE', NULL),
(53, 'PRN241033', 'Mohit', 'Khanna', 'mohit.khanna@example.com', '9801234592', 'MALE', NULL),
(54, 'PRN241034', 'Neha', 'Vohra', 'neha.vohra@example.com', '9801234593', 'FEMALE', NULL),
(55, 'PRN241035', 'Pawan', 'Mehrotra', 'pawan.mehrotra@example.com', '9801234594', 'MALE', NULL),
(56, 'PRN241036', 'Sonal', 'Dutta', 'sonal.dutta@example.com', '9801234595', 'FEMALE', NULL),
(57, 'PRN241037', 'Ashish', 'Talwar', 'ashish.talwar@example.com', '9801234596', 'MALE', NULL),
(58, 'PRN241038', 'Anushka', 'Bose', 'anushka.bose@example.com', '9801234597', 'FEMALE', NULL),
(59, 'PRN241039', 'Rajat', 'Mathur', 'rajat.mathur@example.com', '9801234598', 'MALE', NULL),
(60, 'PRN241040', 'Kritika', 'Sharma', 'kritika.sharma@example.com', '9801234599', 'FEMALE', NULL),

-- AUG_2024 PG-DAC students (10 students)
(61, 'PRN242001', 'Abhishek', 'Chatterjee', 'abhishek.c@example.com', '9802345600', 'MALE', NULL),
(62, 'PRN242002', 'Shweta', 'Ghosh', 'shweta.ghosh@example.com', '9802345601', 'FEMALE', NULL),
(63, 'PRN242003', 'Vivek', 'Mukherjee', 'vivek.m@example.com', '9802345602', 'MALE', NULL),
(64, 'PRN242004', 'Aarti', 'Sen', 'aarti.sen@example.com', '9802345603', 'FEMALE', NULL),
(65, 'PRN242005', 'Mayank', 'Roy', 'mayank.roy@example.com', '9802345604', 'MALE', NULL),
(66, 'PRN242006', 'Simran', 'Bhattacharya', 'simran.b@example.com', '9802345605', 'FEMALE', NULL),
(67, 'PRN242007', 'Tarun', 'Dey', 'tarun.dey@example.com', '9802345606', 'MALE', NULL),
(68, 'PRN242008', 'Preeti', 'Sarkar', 'preeti.sarkar@example.com', '9802345607', 'FEMALE', NULL),
(69, 'PRN242009', 'Saurabh', 'Banerjee', 'saurabh.b@example.com', '9802345608', 'MALE', NULL),
(70, 'PRN242010', 'Tanya', 'Mitra', 'tanya.mitra@example.com', '9802345609', 'FEMALE', NULL),

-- AUG_2024 PG-DBDA students (10 students)
(71, 'PRN242011', 'Rahul', 'Prasad', 'rahul.prasad@example.com', '9802345610', 'MALE', NULL),
(72, 'PRN242012', 'Shraddha', 'Yadav', 'shraddha.yadav@example.com', '9802345611', 'FEMALE', NULL),
(73, 'PRN242013', 'Amit', 'Thapa', 'amit.thapa@example.com', '9802345612', 'MALE', NULL),
(74, 'PRN242014', 'Rashmi', 'Karki', 'rashmi.karki@example.com', '9802345613', 'FEMALE', NULL),
(75, 'PRN242015', 'Karan', 'Shrestha', 'karan.shrestha@example.com', '9802345614', 'MALE', NULL),
(76, 'PRN242016', 'Deepika', 'Gurung', 'deepika.gurung@example.com', '9802345615', 'FEMALE', NULL),
(77, 'PRN242017', 'Vishal', 'Rai', 'vishal.rai@example.com', '9802345616', 'MALE', NULL),
(78, 'PRN242018', 'Anita', 'Tamang', 'anita.tamang@example.com', '9802345617', 'FEMALE', NULL),
(79, 'PRN242019', 'Prakash', 'Limbu', 'prakash.limbu@example.com', '9802345618', 'MALE', NULL),
(80, 'PRN242020', 'Smita', 'Sherpa', 'smita.sherpa@example.com', '9802345619', 'FEMALE', NULL),

-- AUG_2024 PG-DVLSI students (10 students)
(81, 'PRN242021', 'Sandeep', 'Bisht', 'sandeep.bisht@example.com', '9802345620', 'MALE', NULL),
(82, 'PRN242022', 'Kavita', 'Rawat', 'kavita.rawat@example.com', '9802345621', 'FEMALE', NULL),
(83, 'PRN242023', 'Manoj', 'Negi', 'manoj.negi@example.com', '9802345622', 'MALE', NULL),
(84, 'PRN242024', 'Rekha', 'Joshi', 'rekha.joshi@example.com', '9802345623', 'FEMALE', NULL),
(85, 'PRN242025', 'Anil', 'Sharma', 'anil.sharma@example.com', '9802345624', 'MALE', NULL),
(86, 'PRN242026', 'Geeta', 'Pant', 'geeta.pant@example.com', '9802345625', 'FEMALE', NULL),
(87, 'PRN242027', 'Ravi', 'Bhatt', 'ravi.bhatt@example.com', '9802345626', 'MALE', NULL),
(88, 'PRN242028', 'Meena', 'Tiwari', 'meena.tiwari@example.com', '9802345627', 'FEMALE', NULL),
(89, 'PRN242029', 'Dinesh', 'Pandey', 'dinesh.pandey@example.com', '9802345628', 'MALE', NULL),
(90, 'PRN242030', 'Sunita', 'Joshi', 'sunita.joshi@example.com', '9802345629', 'FEMALE', NULL),

-- AUG_2024 PG-DESD students (10 students)
(91, 'PRN242031', 'Vijay', 'Kumar', 'vijay.kumar@example.com', '9802345630', 'MALE', NULL),
(92, 'PRN242032', 'Pooja', 'Singh', 'pooja.singh2@example.com', '9802345631', 'FEMALE', NULL),
(93, 'PRN242033', 'Naveen', 'Rana', 'naveen.rana@example.com', '9802345632', 'MALE', NULL),
(94, 'PRN242034', 'Sakshi', 'Dhiman', 'sakshi.dhiman@example.com', '9802345633', 'FEMALE', NULL),
(95, 'PRN242035', 'Yogesh', 'Chauhan', 'yogesh.chauhan@example.com', '9802345634', 'MALE', NULL),
(96, 'PRN242036', 'Rina', 'Verma', 'rina.verma@example.com', '9802345635', 'FEMALE', NULL),
(97, 'PRN242037', 'Alok', 'Kashyap', 'alok.kashyap@example.com', '9802345636', 'MALE', NULL),
(98, 'PRN242038', 'Vandana', 'Devi', 'vandana.devi@example.com', '9802345637', 'FEMALE', NULL),
(99, 'PRN242039', 'Hemant', 'Rawat', 'hemant.rawat@example.com', '9802345638', 'MALE', NULL),
(100, 'PRN242040', 'Nidhi', 'Gaur', 'nidhi.gaur@example.com', '9802345639', 'FEMALE', NULL),

-- FEB_2025 PG-DVLSI students (10 students)
(101, 'PRN251011', 'Rohit', 'Mehra', 'rohit.mehra@example.com', '9803456700', 'MALE', NULL),
(102, 'PRN251012', 'Aditi', 'Khanna', 'aditi.khanna@example.com', '9803456701', 'FEMALE', NULL),
(103, 'PRN251013', 'Sahil', 'Gupta', 'sahil.gupta@example.com', '9803456702', 'MALE', NULL),
(104, 'PRN251014', 'Priyanka', 'Dua', 'priyanka.dua@example.com', '9803456703', 'FEMALE', NULL),
(105, 'PRN251015', 'Anuj', 'Kapoor', 'anuj.kapoor@example.com', '9803456704', 'MALE', NULL),
(106, 'PRN251016', 'Sapna', 'Mittal', 'sapna.mittal@example.com', '9803456705', 'FEMALE', NULL),
(107, 'PRN251017', 'Bharat', 'Sood', 'bharat.sood@example.com', '9803456706', 'MALE', NULL),
(108, 'PRN251018', 'Renu', 'Bedi', 'renu.bedi@example.com', '9803456707', 'FEMALE', NULL),
(109, 'PRN251019', 'Chetan', 'Anand', 'chetan.anand@example.com', '9803456708', 'MALE', NULL),
(110, 'PRN251020', 'Payal', 'Madan', 'payal.madan@example.com', '9803456709', 'FEMALE', NULL),

-- FEB_2025 PG-DESD students (10 students)
(111, 'PRN251021', 'Sumit', 'Taneja', 'sumit.taneja@example.com', '9803456710', 'MALE', NULL),
(112, 'PRN251022', 'Neelam', 'Sachdeva', 'neelam.sachdeva@example.com', '9803456711', 'FEMALE', NULL),
(113, 'PRN251023', 'Puneet', 'Bajwa', 'puneet.bajwa@example.com', '9803456712', 'MALE', NULL),
(114, 'PRN251024', 'Shikha', 'Garg', 'shikha.garg@example.com', '9803456713', 'FEMALE', NULL),
(115, 'PRN251025', 'Jatin', 'Sehgal', 'jatin.sehgal@example.com', '9803456714', 'MALE', NULL),
(116, 'PRN251026', 'Neetu', 'Gill', 'neetu.gill@example.com', '9803456715', 'FEMALE', NULL),
(117, 'PRN251027', 'Manpreet', 'Singh', 'manpreet.singh@example.com', '9803456716', 'MALE', NULL),
(118, 'PRN251028', 'Jasleen', 'Kaur', 'jasleen.kaur@example.com', '9803456717', 'FEMALE', NULL),
(119, 'PRN251029', 'Kunal', 'Dhillon', 'kunal.dhillon@example.com', '9803456718', 'MALE', NULL),
(120, 'PRN251030', 'Arpita', 'Bhatia', 'arpita.bhatia@example.com', '9803456719', 'FEMALE', NULL),

-- AUG_2025 PG-DVLSI students (10 students)
(121, 'PRN252011', 'Harpreet', 'Sandhu', 'harpreet.sandhu@example.com', '9804567800', 'MALE', NULL),
(122, 'PRN252012', 'Simran', 'Kohli', 'simran.kohli@example.com', '9804567801', 'FEMALE', NULL),
(123, 'PRN252013', 'Jaspreet', 'Grewal', 'jaspreet.grewal@example.com', '9804567802', 'MALE', NULL),
(124, 'PRN252014', 'Gurleen', 'Arora', 'gurleen.arora@example.com', '9804567803', 'FEMALE', NULL),
(125, 'PRN252015', 'Ramandeep', 'Brar', 'ramandeep.brar@example.com', '9804567804', 'MALE', NULL),
(126, 'PRN252016', 'Navneet', 'Malhotra', 'navneet.malhotra@example.com', '9804567805', 'FEMALE', NULL),
(127, 'PRN252017', 'Sukhvinder', 'Sethi', 'sukhvinder.sethi@example.com', '9804567806', 'MALE', NULL),
(128, 'PRN252018', 'Amrita', 'Chopra', 'amrita.chopra@example.com', '9804567807', 'FEMALE', NULL),
(129, 'PRN252019', 'Baljinder', 'Ahuja', 'baljinder.ahuja@example.com', '9804567808', 'MALE', NULL),
(130, 'PRN252020', 'Parminder', 'Wadhwa', 'parminder.wadhwa@example.com', '9804567809', 'FEMALE', NULL),

-- AUG_2025 PG-DESD students (10 students)
(131, 'PRN252021', 'Lakhvinder', 'Sodhi', 'lakhvinder.sodhi@example.com', '9804567810', 'MALE', NULL),
(132, 'PRN252022', 'Jasmeet', 'Bhalla', 'jasmeet.bhalla@example.com', '9804567811', 'FEMALE', NULL),
(133, 'PRN252023', 'Kuldeep', 'Anand', 'kuldeep.anand@example.com', '9804567812', 'MALE', NULL),
(134, 'PRN252024', 'Ravneet', 'Khurana', 'ravneet.khurana@example.com', '9804567813', 'FEMALE', NULL),
(135, 'PRN252025', 'Tajinder', 'Vohra', 'tajinder.vohra@example.com', '9804567814', 'MALE', NULL),
(136, 'PRN252026', 'Jyoti', 'Talwar', 'jyoti.talwar@example.com', '9804567815', 'FEMALE', NULL),
(137, 'PRN252027', 'Balwinder', 'Dhingra', 'balwinder.dhingra@example.com', '9804567816', 'MALE', NULL),
(138, 'PRN252028', 'Mandeep', 'Bajaj', 'mandeep.bajaj@example.com', '9804567817', 'FEMALE', NULL),
(139, 'PRN252029', 'Sukhbir', 'Luthra', 'sukhbir.luthra@example.com', '9804567818', 'MALE', NULL),
(140, 'PRN252030', 'Amandeep', 'Goyal', 'amandeep.goyal@example.com', '9804567819', 'FEMALE', NULL),

-- FEB_2026 PG-DAC students (10 students)
(141, 'PRN261001', 'Hardeep', 'Puri', 'hardeep.puri@example.com', '9805678900', 'MALE', NULL),
(142, 'PRN261002', 'Kulwinder', 'Saini', 'kulwinder.saini@example.com', '9805678901', 'FEMALE', NULL),
(143, 'PRN261003', 'Mahendra', 'Nanda', 'mahendra.nanda@example.com', '9805678902', 'MALE', NULL),
(144, 'PRN261004', 'Radhika', 'Seth', 'radhika.seth@example.com', '9805678903', 'FEMALE', NULL),
(145, 'PRN261005', 'Vikrant', 'Dang', 'vikrant.dang@example.com', '9805678904', 'MALE', NULL),
(146, 'PRN261006', 'Lalita', 'Raman', 'lalita.raman@example.com', '9805678905', 'FEMALE', NULL),
(147, 'PRN261007', 'Navdeep', 'Trehan', 'navdeep.trehan@example.com', '9805678906', 'MALE', NULL),
(148, 'PRN261008', 'Manisha', 'Bedi', 'manisha.bedi@example.com', '9805678907', 'FEMALE', NULL),
(149, 'PRN261009', 'Amarjeet', 'Dutta', 'amarjeet.dutta@example.com', '9805678908', 'MALE', NULL),
(150, 'PRN261010', 'Kamini', 'Hora', 'kamini.hora@example.com', '9805678909', 'FEMALE', NULL),

-- FEB_2026 PG-DBDA students (10 students)
(151, 'PRN261011', 'Praveen', 'Kohli', 'praveen.kohli@example.com', '9805678910', 'MALE', NULL),
(152, 'PRN261012', 'Shalini', 'Basu', 'shalini.basu@example.com', '9805678911', 'FEMALE', NULL),
(153, 'PRN261013', 'Sameer', 'Dhar', 'sameer.dhar@example.com', '9805678912', 'MALE', NULL),
(154, 'PRN261014', 'Rashi', 'Mitra', 'rashi.mitra@example.com', '9805678913', 'FEMALE', NULL),
(155, 'PRN261015', 'Devendra', 'Sengupta', 'devendra.sengupta@example.com', '9805678914', 'MALE', NULL),
(156, 'PRN261016', 'Lakshmi', 'Ganguly', 'lakshmi.ganguly@example.com', '9805678915', 'FEMALE', NULL),
(157, 'PRN261017', 'Neeraj', 'Biswas', 'neeraj.biswas@example.com', '9805678916', 'MALE', NULL),
(158, 'PRN261018', 'Monika', 'Chaudhary', 'monika.chaudhary@example.com', '9805678917', 'FEMALE', NULL),
(159, 'PRN261019', 'Arvind', 'Bhardwaj', 'arvind.bhardwaj@example.com', '9805678918', 'MALE', NULL),
(160, 'PRN261020', 'Sharda', 'Srivastava', 'sharda.srivastava@example.com', '9805678919', 'FEMALE', NULL),

-- FEB_2026 PG-DAI students (10 students)
(161, 'PRN261021', 'Subhash', 'Tripathi', 'subhash.tripathi@example.com', '9805678920', 'MALE', NULL),
(162, 'PRN261022', 'Urmila', 'Pathak', 'urmila.pathak@example.com', '9805678921', 'FEMALE', NULL),
(163, 'PRN261023', 'Gopal', 'Awasthi', 'gopal.awasthi@example.com', '9805678922', 'MALE', NULL),
(164, 'PRN261024', 'Kaveri', 'Dwivedi', 'kaveri.dwivedi@example.com', '9805678923', 'FEMALE', NULL),
(165, 'PRN261025', 'Ramesh', 'Ojha', 'ramesh.ojha@example.com', '9805678924', 'MALE', NULL),
(166, 'PRN261026', 'Vidya', 'Shukla', 'vidya.shukla@example.com', '9805678925', 'FEMALE', NULL),
(167, 'PRN261027', 'Mukesh', 'Pande', 'mukesh.pande@example.com', '9805678926', 'MALE', NULL),
(168, 'PRN261028', 'Savita', 'Joshi', 'savita.joshi@example.com', '9805678927', 'FEMALE', NULL),
(169, 'PRN261029', 'Santosh', 'Dubey', 'santosh.dubey@example.com', '9805678928', 'MALE', NULL),
(170, 'PRN261030', 'Rashmi', 'Upadhyay', 'rashmi.upadhyay@example.com', '9805678929', 'FEMALE', NULL),

-- FEB_2026 PG-DVLSI students (10 students)
(171, 'PRN261031', 'Rakesh', 'Misra', 'rakesh.misra@example.com', '9805678930', 'MALE', NULL),
(172, 'PRN261032', 'Sunita', 'Dikshit', 'sunita.dikshit@example.com', '9805678931', 'FEMALE', NULL),
(173, 'PRN261033', 'Kamlesh', 'Rastogi', 'kamlesh.rastogi@example.com', '9805678932', 'MALE', NULL),
(174, 'PRN261034', 'Bharti', 'Saxena', 'bharti.saxena@example.com', '9805678933', 'FEMALE', NULL),
(175, 'PRN261035', 'Ashok', 'Srivastav', 'ashok.srivastav@example.com', '9805678934', 'MALE', NULL),
(176, 'PRN261036', 'Anjana', 'Dubey', 'anjana.dubey@example.com', '9805678935', 'FEMALE', NULL),
(177, 'PRN261037', 'Dinesh', 'Tewari', 'dinesh.tewari@example.com', '9805678936', 'MALE', NULL),
(178, 'PRN261038', 'Rekha', 'Verma', 'rekha.verma@example.com', '9805678937', 'FEMALE', NULL),
(179, 'PRN261039', 'Brijesh', 'Pandey', 'brijesh.pandey@example.com', '9805678938', 'MALE', NULL),
(180, 'PRN261040', 'Kiran', 'Mishra', 'kiran.mishra@example.com', '9805678939', 'FEMALE', NULL),

-- FEB_2026 PG-DESD students (10 students)
(181, 'PRN261041', 'Surendra', 'Rai', 'surendra.rai@example.com', '9805678940', 'MALE', NULL),
(182, 'PRN261042', 'Rajni', 'Thakur', 'rajni.thakur@example.com', '9805678941', 'FEMALE', NULL),
(183, 'PRN261043', 'Mukund', 'Chaturvedi', 'mukund.chaturvedi@example.com', '9805678942', 'MALE', NULL),
(184, 'PRN261044', 'Archana', 'Gupta', 'archana.gupta@example.com', '9805678943', 'FEMALE', NULL),
(185, 'PRN261045', 'Yogendra', 'Sharma', 'yogendra.sharma@example.com', '9805678944', 'MALE', NULL),
(186, 'PRN261046', 'Madhuri', 'Tiwari', 'madhuri.tiwari@example.com', '9805678945', 'FEMALE', NULL),
(187, 'PRN261047', 'Giridhar', 'Jha', 'giridhar.jha@example.com', '9805678946', 'MALE', NULL),
(188, 'PRN261048', 'Lata', 'Pandey', 'lata.pandey@example.com', '9805678947', 'FEMALE', NULL),
(189, 'PRN261049', 'Trilok', 'Dixit', 'trilok.dixit@example.com', '9805678948', 'MALE', NULL),
(190, 'PRN261050', 'Kamla', 'Rao', 'kamla.rao@example.com', '9805678949', 'FEMALE', NULL),

-- AUG_2026 students (10 students total - 2 per course)
-- AUG_2026 PG-DAC students (2 students)
(191, 'PRN262001', 'Satish', 'Jain', 'satish.jain@example.com', '9806789000', 'MALE', NULL),
(192, 'PRN262002', 'Indira', 'Aggarwal', 'indira.aggarwal@example.com', '9806789001', 'FEMALE', NULL),

-- AUG_2026 PG-DBDA students (2 students)
(193, 'PRN262003', 'Lalit', 'Tandon', 'lalit.tandon@example.com', '9806789002', 'MALE', NULL),
(194, 'PRN262004', 'Usha', 'Sinha', 'usha.sinha@example.com', '9806789003', 'FEMALE', NULL),

-- AUG_2026 PG-DAI students (2 students)
(195, 'PRN262005', 'Mahesh', 'Bansal', 'mahesh.bansal@example.com', '9806789004', 'MALE', NULL),
(196, 'PRN262006', 'Poonam', 'Khanna', 'poonam.khanna@example.com', '9806789005', 'FEMALE', NULL),

-- AUG_2026 PG-DVLSI students (2 students)
(197, 'PRN262007', 'Ramesh', 'Kohli', 'ramesh.kohli@example.com', '9806789006', 'MALE', NULL),
(198, 'PRN262008', 'Sheela', 'Mehta', 'sheela.mehta@example.com', '9806789007', 'FEMALE', NULL),

-- AUG_2026 PG-DESD students (2 students)
(199, 'PRN262009', 'Naresh', 'Sood', 'naresh.sood@example.com', '9806789008', 'MALE', NULL),
(200, 'PRN262010', 'Maya', 'Kapur', 'maya.kapur@example.com', '9806789009', 'FEMALE', NULL);

-- =====================================================
-- INSERT STUDENT ENROLLMENTS IN academic_db
-- Links students to batch_courses
-- =====================================================

USE academic_db;

-- Insert student enrollments for all new students
INSERT INTO student_enrollments (user_id, batch_course_id, status)
VALUES
-- FEB_2024 PG-DAC (batch_course_id = 9): user_ids 21-30
(21, 9, 'ACTIVE'), (22, 9, 'ACTIVE'), (23, 9, 'ACTIVE'), (24, 9, 'ACTIVE'), (25, 9, 'ACTIVE'),
(26, 9, 'ACTIVE'), (27, 9, 'ACTIVE'), (28, 9, 'ACTIVE'), (29, 9, 'ACTIVE'), (30, 9, 'ACTIVE'),

-- FEB_2024 PG-DBDA (batch_course_id = 10): user_ids 31-40
(31, 10, 'ACTIVE'), (32, 10, 'ACTIVE'), (33, 10, 'ACTIVE'), (34, 10, 'ACTIVE'), (35, 10, 'ACTIVE'),
(36, 10, 'ACTIVE'), (37, 10, 'ACTIVE'), (38, 10, 'ACTIVE'), (39, 10, 'ACTIVE'), (40, 10, 'ACTIVE'),

-- FEB_2024 PG-DVLSI (batch_course_id = 11): user_ids 41-50
(41, 11, 'ACTIVE'), (42, 11, 'ACTIVE'), (43, 11, 'ACTIVE'), (44, 11, 'ACTIVE'), (45, 11, 'ACTIVE'),
(46, 11, 'ACTIVE'), (47, 11, 'ACTIVE'), (48, 11, 'ACTIVE'), (49, 11, 'ACTIVE'), (50, 11, 'ACTIVE'),

-- FEB_2024 PG-DESD (batch_course_id = 12): user_ids 51-60
(51, 12, 'ACTIVE'), (52, 12, 'ACTIVE'), (53, 12, 'ACTIVE'), (54, 12, 'ACTIVE'), (55, 12, 'ACTIVE'),
(56, 12, 'ACTIVE'), (57, 12, 'ACTIVE'), (58, 12, 'ACTIVE'), (59, 12, 'ACTIVE'), (60, 12, 'ACTIVE'),

-- AUG_2024 PG-DAC (batch_course_id = 13): user_ids 61-70
(61, 13, 'ACTIVE'), (62, 13, 'ACTIVE'), (63, 13, 'ACTIVE'), (64, 13, 'ACTIVE'), (65, 13, 'ACTIVE'),
(66, 13, 'ACTIVE'), (67, 13, 'ACTIVE'), (68, 13, 'ACTIVE'), (69, 13, 'ACTIVE'), (70, 13, 'ACTIVE'),

-- AUG_2024 PG-DBDA (batch_course_id = 14): user_ids 71-80
(71, 14, 'ACTIVE'), (72, 14, 'ACTIVE'), (73, 14, 'ACTIVE'), (74, 14, 'ACTIVE'), (75, 14, 'ACTIVE'),
(76, 14, 'ACTIVE'), (77, 14, 'ACTIVE'), (78, 14, 'ACTIVE'), (79, 14, 'ACTIVE'), (80, 14, 'ACTIVE'),

-- AUG_2024 PG-DVLSI (batch_course_id = 15): user_ids 81-90
(81, 15, 'ACTIVE'), (82, 15, 'ACTIVE'), (83, 15, 'ACTIVE'), (84, 15, 'ACTIVE'), (85, 15, 'ACTIVE'),
(86, 15, 'ACTIVE'), (87, 15, 'ACTIVE'), (88, 15, 'ACTIVE'), (89, 15, 'ACTIVE'), (90, 15, 'ACTIVE'),

-- AUG_2024 PG-DESD (batch_course_id = 16): user_ids 91-100
(91, 16, 'ACTIVE'), (92, 16, 'ACTIVE'), (93, 16, 'ACTIVE'), (94, 16, 'ACTIVE'), (95, 16, 'ACTIVE'),
(96, 16, 'ACTIVE'), (97, 16, 'ACTIVE'), (98, 16, 'ACTIVE'), (99, 16, 'ACTIVE'), (100, 16, 'ACTIVE'),

-- FEB_2025 PG-DVLSI (batch_course_id = 17): user_ids 101-110
(101, 17, 'ACTIVE'), (102, 17, 'ACTIVE'), (103, 17, 'ACTIVE'), (104, 17, 'ACTIVE'), (105, 17, 'ACTIVE'),
(106, 17, 'ACTIVE'), (107, 17, 'ACTIVE'), (108, 17, 'ACTIVE'), (109, 17, 'ACTIVE'), (110, 17, 'ACTIVE'),

-- FEB_2025 PG-DESD (batch_course_id = 18): user_ids 111-120
(111, 18, 'ACTIVE'), (112, 18, 'ACTIVE'), (113, 18, 'ACTIVE'), (114, 18, 'ACTIVE'), (115, 18, 'ACTIVE'),
(116, 18, 'ACTIVE'), (117, 18, 'ACTIVE'), (118, 18, 'ACTIVE'), (119, 18, 'ACTIVE'), (120, 18, 'ACTIVE'),

-- AUG_2025 PG-DVLSI (batch_course_id = 19): user_ids 121-130
(121, 19, 'ACTIVE'), (122, 19, 'ACTIVE'), (123, 19, 'ACTIVE'), (124, 19, 'ACTIVE'), (125, 19, 'ACTIVE'),
(126, 19, 'ACTIVE'), (127, 19, 'ACTIVE'), (128, 19, 'ACTIVE'), (129, 19, 'ACTIVE'), (130, 19, 'ACTIVE'),

-- AUG_2025 PG-DESD (batch_course_id = 20): user_ids 131-140
(131, 20, 'ACTIVE'), (132, 20, 'ACTIVE'), (133, 20, 'ACTIVE'), (134, 20, 'ACTIVE'), (135, 20, 'ACTIVE'),
(136, 20, 'ACTIVE'), (137, 20, 'ACTIVE'), (138, 20, 'ACTIVE'), (139, 20, 'ACTIVE'), (140, 20, 'ACTIVE'),

-- FEB_2026 PG-DAC (batch_course_id = 21): user_ids 141-150
(141, 21, 'ACTIVE'), (142, 21, 'ACTIVE'), (143, 21, 'ACTIVE'), (144, 21, 'ACTIVE'), (145, 21, 'ACTIVE'),
(146, 21, 'ACTIVE'), (147, 21, 'ACTIVE'), (148, 21, 'ACTIVE'), (149, 21, 'ACTIVE'), (150, 21, 'ACTIVE'),

-- FEB_2026 PG-DBDA (batch_course_id = 22): user_ids 151-160
(151, 22, 'ACTIVE'), (152, 22, 'ACTIVE'), (153, 22, 'ACTIVE'), (154, 22, 'ACTIVE'), (155, 22, 'ACTIVE'),
(156, 22, 'ACTIVE'), (157, 22, 'ACTIVE'), (158, 22, 'ACTIVE'), (159, 22, 'ACTIVE'), (160, 22, 'ACTIVE'),

-- FEB_2026 PG-DAI (batch_course_id = 23): user_ids 161-170
(161, 23, 'ACTIVE'), (162, 23, 'ACTIVE'), (163, 23, 'ACTIVE'), (164, 23, 'ACTIVE'), (165, 23, 'ACTIVE'),
(166, 23, 'ACTIVE'), (167, 23, 'ACTIVE'), (168, 23, 'ACTIVE'), (169, 23, 'ACTIVE'), (170, 23, 'ACTIVE'),

-- FEB_2026 PG-DVLSI (batch_course_id = 24): user_ids 171-180
(171, 24, 'ACTIVE'), (172, 24, 'ACTIVE'), (173, 24, 'ACTIVE'), (174, 24, 'ACTIVE'), (175, 24, 'ACTIVE'),
(176, 24, 'ACTIVE'), (177, 24, 'ACTIVE'), (178, 24, 'ACTIVE'), (179, 24, 'ACTIVE'), (180, 24, 'ACTIVE'),

-- FEB_2026 PG-DESD (batch_course_id = 25): user_ids 181-190
(181, 25, 'ACTIVE'), (182, 25, 'ACTIVE'), (183, 25, 'ACTIVE'), (184, 25, 'ACTIVE'), (185, 25, 'ACTIVE'),
(186, 25, 'ACTIVE'), (187, 25, 'ACTIVE'), (188, 25, 'ACTIVE'), (189, 25, 'ACTIVE'), (190, 25, 'ACTIVE'),

-- AUG_2026 PG-DAC (batch_course_id = 26): user_ids 191-192
(191, 26, 'ACTIVE'), (192, 26, 'ACTIVE'),

-- AUG_2026 PG-DBDA (batch_course_id = 27): user_ids 193-194
(193, 27, 'ACTIVE'), (194, 27, 'ACTIVE'),

-- AUG_2026 PG-DAI (batch_course_id = 28): user_ids 195-196
(195, 28, 'ACTIVE'), (196, 28, 'ACTIVE'),

-- AUG_2026 PG-DVLSI (batch_course_id = 29): user_ids 197-198
(197, 29, 'ACTIVE'), (198, 29, 'ACTIVE'),

-- AUG_2026 PG-DESD (batch_course_id = 30): user_ids 199-200
(199, 30, 'ACTIVE'), (200, 30, 'ACTIVE');

-- =====================================================
-- INSERT FACULTY ASSIGNMENTS IN academic_db
-- Faculty user_ids: 2, 3, 4 (existing), 9-20 (new) = 15 total
-- =====================================================

-- Faculty assignments for all batch_course_subjects
-- Rotating faculty across subjects
INSERT INTO faculty_assignments (user_id, batch_course_subject_id, status)
VALUES
-- FEB_2024 PG-DAC (bcs_id 11-21): 11 subjects
(2, 11, 'ACTIVE'), (3, 12, 'ACTIVE'), (4, 13, 'ACTIVE'), (9, 14, 'ACTIVE'), (10, 15, 'ACTIVE'),
(11, 16, 'ACTIVE'), (12, 17, 'ACTIVE'), (13, 18, 'ACTIVE'), (14, 19, 'ACTIVE'), (15, 20, 'ACTIVE'), (16, 21, 'ACTIVE'),

-- FEB_2024 PG-DBDA (bcs_id 22-30): 9 subjects
(17, 22, 'ACTIVE'), (18, 23, 'ACTIVE'), (19, 24, 'ACTIVE'), (20, 25, 'ACTIVE'), (2, 26, 'ACTIVE'),
(3, 27, 'ACTIVE'), (4, 28, 'ACTIVE'), (9, 29, 'ACTIVE'), (10, 30, 'ACTIVE'),

-- FEB_2024 PG-DVLSI (bcs_id 31-39): 9 subjects
(11, 31, 'ACTIVE'), (12, 32, 'ACTIVE'), (13, 33, 'ACTIVE'), (14, 34, 'ACTIVE'), (15, 35, 'ACTIVE'),
(16, 36, 'ACTIVE'), (17, 37, 'ACTIVE'), (18, 38, 'ACTIVE'), (19, 39, 'ACTIVE'),

-- FEB_2024 PG-DESD (bcs_id 40-48): 9 subjects
(20, 40, 'ACTIVE'), (2, 41, 'ACTIVE'), (3, 42, 'ACTIVE'), (4, 43, 'ACTIVE'), (9, 44, 'ACTIVE'),
(10, 45, 'ACTIVE'), (11, 46, 'ACTIVE'), (12, 47, 'ACTIVE'), (13, 48, 'ACTIVE'),

-- AUG_2024 PG-DAC (bcs_id 49-59): 11 subjects
(14, 49, 'ACTIVE'), (15, 50, 'ACTIVE'), (16, 51, 'ACTIVE'), (17, 52, 'ACTIVE'), (18, 53, 'ACTIVE'),
(19, 54, 'ACTIVE'), (20, 55, 'ACTIVE'), (2, 56, 'ACTIVE'), (3, 57, 'ACTIVE'), (4, 58, 'ACTIVE'), (9, 59, 'ACTIVE'),

-- AUG_2024 PG-DBDA (bcs_id 60-68): 9 subjects
(10, 60, 'ACTIVE'), (11, 61, 'ACTIVE'), (12, 62, 'ACTIVE'), (13, 63, 'ACTIVE'), (14, 64, 'ACTIVE'),
(15, 65, 'ACTIVE'), (16, 66, 'ACTIVE'), (17, 67, 'ACTIVE'), (18, 68, 'ACTIVE'),

-- AUG_2024 PG-DVLSI (bcs_id 69-77): 9 subjects
(19, 69, 'ACTIVE'), (20, 70, 'ACTIVE'), (2, 71, 'ACTIVE'), (3, 72, 'ACTIVE'), (4, 73, 'ACTIVE'),
(9, 74, 'ACTIVE'), (10, 75, 'ACTIVE'), (11, 76, 'ACTIVE'), (12, 77, 'ACTIVE'),

-- AUG_2024 PG-DESD (bcs_id 78-86): 9 subjects
(13, 78, 'ACTIVE'), (14, 79, 'ACTIVE'), (15, 80, 'ACTIVE'), (16, 81, 'ACTIVE'), (17, 82, 'ACTIVE'),
(18, 83, 'ACTIVE'), (19, 84, 'ACTIVE'), (20, 85, 'ACTIVE'), (2, 86, 'ACTIVE'),

-- FEB_2025 PG-DVLSI (bcs_id 87-95): 9 subjects
(3, 87, 'ACTIVE'), (4, 88, 'ACTIVE'), (9, 89, 'ACTIVE'), (10, 90, 'ACTIVE'), (11, 91, 'ACTIVE'),
(12, 92, 'ACTIVE'), (13, 93, 'ACTIVE'), (14, 94, 'ACTIVE'), (15, 95, 'ACTIVE'),

-- FEB_2025 PG-DESD (bcs_id 96-104): 9 subjects
(16, 96, 'ACTIVE'), (17, 97, 'ACTIVE'), (18, 98, 'ACTIVE'), (19, 99, 'ACTIVE'), (20, 100, 'ACTIVE'),
(2, 101, 'ACTIVE'), (3, 102, 'ACTIVE'), (4, 103, 'ACTIVE'), (9, 104, 'ACTIVE'),

-- AUG_2025 PG-DVLSI (bcs_id 105-113): 9 subjects
(10, 105, 'ACTIVE'), (11, 106, 'ACTIVE'), (12, 107, 'ACTIVE'), (13, 108, 'ACTIVE'), (14, 109, 'ACTIVE'),
(15, 110, 'ACTIVE'), (16, 111, 'ACTIVE'), (17, 112, 'ACTIVE'), (18, 113, 'ACTIVE'),

-- AUG_2025 PG-DESD (bcs_id 114-122): 9 subjects
(19, 114, 'ACTIVE'), (20, 115, 'ACTIVE'), (2, 116, 'ACTIVE'), (3, 117, 'ACTIVE'), (4, 118, 'ACTIVE'),
(9, 119, 'ACTIVE'), (10, 120, 'ACTIVE'), (11, 121, 'ACTIVE'), (12, 122, 'ACTIVE'),

-- FEB_2026 PG-DAC (bcs_id 123-133): 11 subjects
(13, 123, 'ACTIVE'), (14, 124, 'ACTIVE'), (15, 125, 'ACTIVE'), (16, 126, 'ACTIVE'), (17, 127, 'ACTIVE'),
(18, 128, 'ACTIVE'), (19, 129, 'ACTIVE'), (20, 130, 'ACTIVE'), (2, 131, 'ACTIVE'), (3, 132, 'ACTIVE'), (4, 133, 'ACTIVE'),

-- FEB_2026 PG-DBDA (bcs_id 134-142): 9 subjects
(9, 134, 'ACTIVE'), (10, 135, 'ACTIVE'), (11, 136, 'ACTIVE'), (12, 137, 'ACTIVE'), (13, 138, 'ACTIVE'),
(14, 139, 'ACTIVE'), (15, 140, 'ACTIVE'), (16, 141, 'ACTIVE'), (17, 142, 'ACTIVE'),

-- FEB_2026 PG-DAI (bcs_id 143-151): 9 subjects
(18, 143, 'ACTIVE'), (19, 144, 'ACTIVE'), (20, 145, 'ACTIVE'), (2, 146, 'ACTIVE'), (3, 147, 'ACTIVE'),
(4, 148, 'ACTIVE'), (9, 149, 'ACTIVE'), (10, 150, 'ACTIVE'), (11, 151, 'ACTIVE'),

-- FEB_2026 PG-DVLSI (bcs_id 152-160): 9 subjects
(12, 152, 'ACTIVE'), (13, 153, 'ACTIVE'), (14, 154, 'ACTIVE'), (15, 155, 'ACTIVE'), (16, 156, 'ACTIVE'),
(17, 157, 'ACTIVE'), (18, 158, 'ACTIVE'), (19, 159, 'ACTIVE'), (20, 160, 'ACTIVE'),

-- FEB_2026 PG-DESD (bcs_id 161-169): 9 subjects
(2, 161, 'ACTIVE'), (3, 162, 'ACTIVE'), (4, 163, 'ACTIVE'), (9, 164, 'ACTIVE'), (10, 165, 'ACTIVE'),
(11, 166, 'ACTIVE'), (12, 167, 'ACTIVE'), (13, 168, 'ACTIVE'), (14, 169, 'ACTIVE'),

-- AUG_2026 PG-DAC (bcs_id 170-180): 11 subjects
(15, 170, 'ACTIVE'), (16, 171, 'ACTIVE'), (17, 172, 'ACTIVE'), (18, 173, 'ACTIVE'), (19, 174, 'ACTIVE'),
(20, 175, 'ACTIVE'), (2, 176, 'ACTIVE'), (3, 177, 'ACTIVE'), (4, 178, 'ACTIVE'), (9, 179, 'ACTIVE'), (10, 180, 'ACTIVE'),

-- AUG_2026 PG-DBDA (bcs_id 181-189): 9 subjects
(11, 181, 'ACTIVE'), (12, 182, 'ACTIVE'), (13, 183, 'ACTIVE'), (14, 184, 'ACTIVE'), (15, 185, 'ACTIVE'),
(16, 186, 'ACTIVE'), (17, 187, 'ACTIVE'), (18, 188, 'ACTIVE'), (19, 189, 'ACTIVE'),

-- AUG_2026 PG-DAI (bcs_id 190-198): 9 subjects
(20, 190, 'ACTIVE'), (2, 191, 'ACTIVE'), (3, 192, 'ACTIVE'), (4, 193, 'ACTIVE'), (9, 194, 'ACTIVE'),
(10, 195, 'ACTIVE'), (11, 196, 'ACTIVE'), (12, 197, 'ACTIVE'), (13, 198, 'ACTIVE'),

-- AUG_2026 PG-DVLSI (bcs_id 199-207): 9 subjects
(14, 199, 'ACTIVE'), (15, 200, 'ACTIVE'), (16, 201, 'ACTIVE'), (17, 202, 'ACTIVE'), (18, 203, 'ACTIVE'),
(19, 204, 'ACTIVE'), (20, 205, 'ACTIVE'), (2, 206, 'ACTIVE'), (3, 207, 'ACTIVE'),

-- AUG_2026 PG-DESD (bcs_id 208-216): 9 subjects
(4, 208, 'ACTIVE'), (9, 209, 'ACTIVE'), (10, 210, 'ACTIVE'), (11, 211, 'ACTIVE'), (12, 212, 'ACTIVE'),
(13, 213, 'ACTIVE'), (14, 214, 'ACTIVE'), (15, 215, 'ACTIVE'), (16, 216, 'ACTIVE');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check total counts
SELECT 'Total Users' as Entity, COUNT(*) as Count FROM users_db.users
UNION ALL
SELECT 'Total Faculties', COUNT(*) FROM users_db.faculties
UNION ALL
SELECT 'Total Students', COUNT(*) FROM users_db.students
UNION ALL
SELECT 'Total Batches', COUNT(*) FROM academic_db.batches
UNION ALL
SELECT 'Total Courses', COUNT(*) FROM academic_db.courses
UNION ALL
SELECT 'Total Subjects', COUNT(*) FROM academic_db.subjects
UNION ALL
SELECT 'Total Batch Courses', COUNT(*) FROM academic_db.batch_courses
UNION ALL
SELECT 'Total Batch Course Subjects', COUNT(*) FROM academic_db.batch_course_subjects
UNION ALL
SELECT 'Total Student Enrollments', COUNT(*) FROM academic_db.student_enrollments
UNION ALL
SELECT 'Total Faculty Assignments', COUNT(*) FROM academic_db.faculty_assignments;

-- =====================================================
-- END OF CORRECTED INSERTION SCRIPT
-- =====================================================