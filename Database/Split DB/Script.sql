-- =====================================================
-- DATABASE 1 - USERS_DB
-- =====================================================

DROP DATABASE IF EXISTS users_db;
CREATE DATABASE users_db;
USE users_db;

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM('STUDENT', 'FACULTY', 'ADMIN')
        NOT NULL,
        
	status ENUM('ACTIVE', 'INACTIVE')
        NOT NULL
        DEFAULT 'ACTIVE',

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_role_status (role, status)
) ENGINE=InnoDB;


CREATE TABLE admins (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    mobile VARCHAR(15) NOT NULL,

    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,

    profile_picture_url VARCHAR(500) NULL,

    CONSTRAINT fk_admins_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_email (email),
    INDEX idx_students_user (user_id)
) ENGINE=InnoDB;


CREATE TABLE faculties (
    faculty_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    mobile VARCHAR(15) NOT NULL,

    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,

    profile_picture_url VARCHAR(500) NULL,

    CONSTRAINT fk_faculties_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_email (email),
    INDEX idx_faculties_user (user_id)
) ENGINE=InnoDB;


CREATE TABLE students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    prn VARCHAR(50) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    mobile VARCHAR(15) NOT NULL,

    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,

    profile_picture_url VARCHAR(500) NULL,

    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

	/*
    CONSTRAINT fk_students_batch_course
        FOREIGN KEY (batch_course_id)
        REFERENCES batch_courses(batch_course_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
	*/

    INDEX idx_students_user (user_id),
    INDEX idx_email (email),
    INDEX idx_prn (prn)
) ENGINE=InnoDB;



-- -----------------------------------------------------
-- AUTOMATIC ACCOUNT DELETION
-- -----------------------------------------------------

-- requires SUPER privilege
SET GLOBAL event_scheduler = ON; 

DELIMITER $$
CREATE EVENT ev_deactivate_old_students
ON SCHEDULE
    EVERY 7 DAY
    STARTS CURRENT_TIMESTAMP
DO
BEGIN
    UPDATE users
    SET status = 'INACTIVE'
    WHERE role = 'STUDENT'
      AND status = 'ACTIVE'
      AND created_at < (CURRENT_TIMESTAMP - INTERVAL 6 MONTH);
END$$
DELIMITER ;



-- -----------------------------------------------------
-- REFRESH TOKENS
-- -----------------------------------------------------

CREATE TABLE refresh_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,

    CONSTRAINT fk_refresh_token_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =====================================================
-- DATABASE 2 - ACADEMIC_DB
-- =====================================================
-- =====================================================
-- DATABASE: academic_db
-- PURPOSE: Batch, Course, Subject management & Enrollments
-- =====================================================

DROP DATABASE IF EXISTS academic_db;
CREATE DATABASE academic_db;
USE academic_db;

-- =====================================================
-- BATCHES
-- =====================================================

CREATE TABLE batches (
    batch_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    batch_name VARCHAR(100) NOT NULL UNIQUE,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    status ENUM('UPCOMING', 'ACTIVE', 'COMPLETED')
        NOT NULL
        DEFAULT 'UPCOMING',

    description TEXT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_batch_dates
        CHECK (end_date > start_date),

    INDEX idx_batch_name (batch_name),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- COURSES
-- =====================================================

CREATE TABLE courses (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    course_code VARCHAR(50) NOT NULL UNIQUE,

    course_name VARCHAR(200) NOT NULL,

    duration_months INT NOT NULL,

    status ENUM('ACTIVE', 'INACTIVE')
        NOT NULL
        DEFAULT 'ACTIVE',

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_course_code (course_code)
) ENGINE=InnoDB;

-- =====================================================
-- SUBJECTS
-- =====================================================

CREATE TABLE subjects (
    subject_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    subject_code VARCHAR(50) NOT NULL,

    subject_name VARCHAR(200) NOT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uq_subject_code (subject_code),
    INDEX idx_subject_code (subject_code)
) ENGINE=InnoDB;

-- =====================================================
-- BATCH-COURSE MAPPING
-- =====================================================

CREATE TABLE batch_courses (
    batch_course_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    batch_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_batch_courses_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(batch_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_batch_courses_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_batch_course
        UNIQUE (batch_id, course_id),

    INDEX idx_batch_id (batch_id),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB;

-- =====================================================
-- BATCH-COURSE-SUBJECT MAPPING
-- =====================================================

CREATE TABLE batch_course_subjects (
    batch_course_subject_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    batch_course_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bcs_batch_course
        FOREIGN KEY (batch_course_id)
        REFERENCES batch_courses(batch_course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_bcs_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_batch_course_subject
        UNIQUE (batch_course_id, subject_id),

    INDEX idx_batch_course_id (batch_course_id),
    INDEX idx_subject_id (subject_id)
) ENGINE=InnoDB;

-- =====================================================
-- STUDENT ENROLLMENTS
-- =====================================================

CREATE TABLE student_enrollments (
    enrollment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- user_id references users_db.users(user_id)
    -- NO foreign key constraint (microservices boundary)
    user_id BIGINT NOT NULL,

    batch_course_id BIGINT NOT NULL,

    enrollment_date DATE
        NOT NULL
        DEFAULT (CURRENT_DATE),

    status ENUM('ACTIVE', 'INACTIVE', 'COMPLETED')
        NOT NULL
        DEFAULT 'ACTIVE',

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_enrollments_batch_course
        FOREIGN KEY (batch_course_id)
        REFERENCES batch_courses(batch_course_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT uq_user_batch_course
        UNIQUE (user_id, batch_course_id),

    INDEX idx_user_id (user_id),
    INDEX idx_batch_course_id (batch_course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- FACULTY ASSIGNMENTS
-- =====================================================

CREATE TABLE faculty_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- user_id references users_db.users(user_id)
    -- NO foreign key constraint (microservices boundary)
    user_id BIGINT NOT NULL,

    batch_course_subject_id BIGINT NOT NULL,

    assigned_date DATE
        NOT NULL
        DEFAULT (CURRENT_DATE),

    status ENUM('ACTIVE', 'INACTIVE')
        NOT NULL
        DEFAULT 'ACTIVE',

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fa_batch_course_subject
        FOREIGN KEY (batch_course_subject_id)
        REFERENCES batch_course_subjects(batch_course_subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_faculty_bcs
        UNIQUE (user_id, batch_course_subject_id),

    INDEX idx_user_id (user_id),
    INDEX idx_batch_course_subject_id (batch_course_subject_id)
) ENGINE=InnoDB;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO batches
(batch_id, batch_name, start_date, end_date, status, description)
VALUES
(2502, 'FEB_2025', '2025-02-04', '2025-08-22', 'COMPLETED', 'February 2025 batch'),
(2508, 'AUG_2025', '2025-08-22', '2026-02-04', 'ACTIVE', 'August 2025 batch');


INSERT INTO courses
(course_id, course_code, course_name, duration_months, status)
VALUES
(40120,'PG-DAC',  'PG Diploma in Advanced Computing',        6, 'ACTIVE'),
(40220,'PG-DBDA', 'PG Diploma in Big Data Analytics',        6, 'ACTIVE'),
(40320,'PG-DAI', 'PG Diploma in Aritificial Intelligence',        6, 'ACTIVE'),
(40420,'PG-DESD', 'PG Diploma in Embedded System Design', 6, 'ACTIVE'),
(40520,'PG-DITISS',  'PG Diploma in IT Infrastructure, Systems and Security',  6, 'ACTIVE'),
(40620,'PG-DVLSI',  'PG Diploma in VLSI Design',  6, 'ACTIVE');

INSERT INTO subjects
(subject_code, subject_name)
VALUES
('DAC01', 'Concepts of Operating Systems and Software development methodologies'),
('DAC02',  'C++ Programming'),
('DAC03',  'Database Technologies'),
('DAC04',  'Object-Oriented Programming with Java'),
('DAC05',  'Data Structures & Algorithms'),
('DAC06',  'Web Programming Technologies'),
('DAC07',  'Web Based Java'),
('DAC08',  'Microsoft DotNet Technology'),
('DBDA01',  'Linux Programming'),
('DBDA02',  'Data collection and DBMS'),
('DBDA03',  'Python and R Programming'),
('DBDA04',  'Java Programming'),
('DBDA05',  'Big Data Technologies'),
('DBDA06',  'Advanced Analysis using Statistics'),
('DBDA07',  'Practical Machine Learning'),
('DBDA08',  'Data Visualization'),
('DAI01',  'Fundamentals of Artificial Intelligence'),
('DAI02',  'Java Programming'),
('DAI03',  'Advanced Programming using Python'),
('DAI04',  'Data Analytics'),
('DAI05',  'Practical Machine Learning'),
('DAI06',  'Deep Neural Networks'),
('DAI07',  'Natural Language Processing and Computer Vision'),
('DAI08',  'AI Compute Platforms, Applications & Trends'),
('DESD01',  'Embedded C Programming'),
('DESD02',  'Data Structures and Algorithms'),
('DESD03',  'Microcontroller Programming and Interfacing'),
('DESD04',  'Embedded Operating Systems'),
('DESD05',  'Embedded Device Driver'),
('DESD06',  'Real-time Operating Systems'),
('DESD07',  'Internet of Things'),
('DITISS01',  'Fundamentals of Computer Networks'),
('DITISS02',  'Programming Concepts'),
('DITISS03',  'Concepts of Operating System and Administration'),
('DITISS04',  'Network Defence and Countermeasures (NDC)'),
('DITISS05',  'Compliance Audit'),
('DITISS06',  'Security Concepts'),
('DITISS07',  'Cyber Forensics'),
('DITISS08',  'Public Key Infrastructure'),
('DITISS09',  'IT Infrastructure Management & DevOps'),
('DVLSI01',  'Advanced Digital Design'),
('DVLSI02',  'System Architecture'),
('DVLSI03',  'Verilog HDL'),
('DVLSI04',  'HDL Simulation and Synthesis'),
('DVLSI05',  'System Verilog'),
('DVLSI06',  'Verification using UVM'),
('DVLSI07',  'Programming Fundamentals for Design and Verification'),
('DVLSI08',  'CMOS VLSI and Aspects of ASIC Design');


INSERT INTO batch_courses
(batch_id, course_id, start_date, end_date)
VALUES
-- FEB_2025 batch (batch_id = 2502)
(2502, 40120, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DAC 1
(2502, 40220, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DBDA 2
(2502, 40320, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DAI 3
(2502, 40420, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DESD 4
(2502, 40520, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DITISS 5
(2502, 40620, '2025-02-04', '2025-08-22'), -- FEB 2025 PG-DVLSI 6


-- AUG_2025 batch (batch_id = 2508)
(2508, 40120, '2025-08-22', '2026-02-04'), -- AUG 2025 PG-DAC 7
(2508, 40220, '2025-08-22', '2026-02-04'), -- AUG 2025 PG-DBDA 8
(2508, 40320, '2025-08-22', '2026-02-04'), -- AUG 2025 PG-DA 9
(2508, 40420, '2025-08-22', '2026-02-04'), -- AUG 2025 PG-DESD 10
(2508, 40520, '2025-08-22', '2026-02-04'), -- AUG 2025 PG-DITISS 11
(2508, 40620, '2025-08-22', '2026-02-04'); -- AUG 2025 PG-DVLSI 12

INSERT INTO batch_course_subjects
(batch_course_id, subject_id)
VALUES
-- FEB 2025 PG-DAC 1
(1,  1), (1, 2), (1, 3), (1, 4), (1,  5),(1,6) ,(1,7), (1,8),

-- FEB 2025 PG-DBDA 2
(2,  9), (2, 10), (2, 11), (2, 12), (2,  13),(2,14) ,(2,15), (2,16),

 -- FEB 2025 PG-DAI 3
 (3,  17), (3, 18), (3, 19), (3, 20), (3,  21),(3,22) ,(3,23), (3,24),
 
 -- FEB 2025 PG-DESD 4
  (4, 25), (4, 26), (4, 27), (4, 28), (4,  29),(4,30) ,(4,31),
  
  -- FEB 2025 PG-DITISS 5
   (5, 32), (5, 33), (5, 34), (5, 35), (5,  36),(5,37) ,(5,38),(5,39),(5,40),
  
 -- FEB 2025 PG-DVLSI 6 
 (6, 41), (6, 42), (6, 43), (6, 44), (6,  45),(6,46) ,(6,48),

-- AUG 2025 PG-DAC 7
(7,  1), (7,  2), (7,  3), (7,  4), (7,  5), (7,  6), (7,  7), (7,  8),

-- AUG 2025 PG-DBDA 8
(8,  9), (8, 10), (8, 11), (8, 12), (8, 13), (8, 14), (8, 15), (8, 16),

-- AUG 2025 PG-DAI 9
(9, 17), (9, 18), (9, 19), (9, 20), (9, 21), (9, 22), (9, 23), (9, 24),

 -- AUG 2025 PG-DESD 10
(10, 25), (10, 26), (10, 27), (10, 28), (10, 29), (10, 30), (10, 31),

  -- AUG 2025 PG-DITISS 11
(11, 32), (11, 33), (11, 34), (11, 35), (11, 36),(11, 37), (11, 38), (11, 39), (11, 40),

 -- AUG 2025 PG-DVLSI 12 
(12, 41), (12, 42), (12, 43), (12, 44), (12, 45),(12, 46), (12, 48);







-- =====================================================
-- DATABASE 3 - ASSIGNMENT_DB
-- =====================================================

DROP DATABASE IF EXISTS assignment_db;
CREATE DATABASE assignment_db;
USE assignment_db;

CREATE TABLE assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    batch_course_subject_id BIGINT NOT NULL,

    created_by_user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_path VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    due_date DATETIME NOT NULL,

    status ENUM('ACTIVE', 'INACTIVE', 'EXPIRED')
        NOT NULL
        DEFAULT 'ACTIVE',

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

	/*
    CONSTRAINT fk_assignments_bcs
        FOREIGN KEY (batch_course_subject_id)
        REFERENCES batch_course_subjects(batch_course_subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	*/
    
    /*
    CONSTRAINT fk_assignments_created_by
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
	*/
    
    INDEX idx_batch_course_subject_id (batch_course_subject_id),
    INDEX idx_created_by (created_by_user_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE submissions (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    assignment_id BIGINT NOT NULL,

    student_user_id BIGINT NOT NULL,

    file_name VARCHAR(255) NULL,

    file_path VARCHAR(500) NULL,

    file_size_bytes BIGINT NULL,

    mime_type VARCHAR(100) NULL,

    grade INT
        NULL
        CHECK (grade BETWEEN 1 AND 10),

    remarks TEXT NULL,

    submitted_at TIMESTAMP NULL,

    status ENUM('NOT_SUBMITTED', 'SUBMITTED', 'EVALUATED')
        NOT NULL
        DEFAULT 'NOT_SUBMITTED',

    CONSTRAINT fk_submissions_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

	/*
    CONSTRAINT fk_submissions_student_user
        FOREIGN KEY (student_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	*/
    
    CONSTRAINT uq_assignment_student
        UNIQUE (assignment_id, student_user_id),

    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_user_id (student_user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;


-- =====================================================
-- DATABASE 4 - NOTIFICATION_DB
-- =====================================================

DROP DATABASE IF EXISTS notification_db;
CREATE DATABASE notification_db;
USE notification_db;

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    -- Indexes for better performance
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_reference (reference_type, reference_id)
);

SET GLOBAL event_scheduler = ON;
DELIMITER $$
CREATE EVENT ev_delete_read_notifications
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
COMMENT 'Removes all notifications that have been read to save space.'
DO
BEGIN
    DELETE FROM notifications 
    WHERE is_read = TRUE 
    AND read_at <= CURRENT_TIMESTAMP;
END$$
DELIMITER ;


