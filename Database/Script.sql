DROP DATABASE IF EXISTS campusdb;
CREATE DATABASE campusdb;
USE campusdb;

-- =====================================================
-- SECTION 1 : ACADEMIC MASTER & NORMALIZATION
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

INSERT INTO batches
(batch_id, batch_name, start_date, end_date, status, description)
VALUES
(251, 'FEB_2025', '2025-02-04', '2025-08-22', 'COMPLETED', 'February 2025 batch'),
(252, 'AUG_2025', '2025-08-22', '2026-02-04', 'ACTIVE', 'August 2025 batch');

ALTER TABLE batches AUTO_INCREMENT = 253;

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

INSERT INTO courses
(course_code, course_name, duration_months, status)
VALUES
('PG-DAC',  'PG Diploma in Advanced Computing',        6, 'ACTIVE'),
('PG-DBDA', 'PG Diploma in Big Data Analytics',        6, 'ACTIVE'),
('PG-DTSS', 'PG Diploma in IT Infrastructure, Systems and Security', 6, 'ACTIVE'),
('PG-DAI',  'PG Diploma in Artificial Intelligence',  6, 'ACTIVE');

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

INSERT INTO subjects
(subject_code, subject_name)
VALUES
('COMM101', 'Effective Communication'),
('APT101',  'Aptitude'),
('ADS201',  'ADS Using Java'),
('CPP101',  'C++ Programming'),
('COS201',  'COSSDM – Concepts of Software Development Models'),
('COS202',  'COSSDM – Git and DevOps'),
('COS203',  'COSSDM – Software Design Models'),
('COS204',  'COSSDM – Software Testing'),
('DBT101',  'Database Technologies'),
('OOP201',  'Object-Oriented Programming with Java'),
('WEB301',  'Web Based Java Programming'),
('WEB101',  'Web Programming Technologies');

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

INSERT INTO batch_courses
(batch_id, course_id, start_date, end_date)
VALUES
-- FEB_2025 batch (batch_id = 251)
(251, 1, '2025-02-04', '2025-08-22'), -- PG-DAC
(251, 2, '2025-02-04', '2025-08-22'), -- PG-DBDA
(251, 3, '2025-02-04', '2025-08-22'), -- PG-DTSS
(251, 4, '2025-02-04', '2025-08-22'), -- PG-DAI

-- AUG_2025 batch (batch_id = 252)
(252, 1, '2025-08-22', '2026-02-04'), -- PG-DAC
(252, 2, '2025-08-22', '2026-02-04'), -- PG-DBDA
(252, 3, '2025-08-22', '2026-02-04'), -- PG-DTSS
(252, 4, '2025-08-22', '2026-02-04'); -- PG-DAI

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

INSERT INTO batch_course_subjects
(batch_course_id, subject_id)
VALUES
-- FEB_2025 batch
(1,  1),   -- PG-DAC: Effective Communication
(1, 11),   -- PG-DAC: Web Based Java Programming (Extra)
(2,  1),   -- PG-DBDA: Effective Communication
(3,  1),   -- PG-DTSS: Effective Communication
(4,  1),   -- PG-DAI: Effective Communication

-- AUG_2025 batch
(5,  1),   -- PG-DAC: Effective Communication
(5, 11),   -- PG-DAC: Web Based Java Programming (Extra)
(6,  1),   -- PG-DBDA: Effective Communication
(7,  1),   -- PG-DTSS: Effective Communication
(8,  1);   -- PG-DAI: Effective Communication

-- =====================================================
-- SECTION 2 : USERS & PROFILES
-- =====================================================

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

INSERT INTO users
(username, password_hash, role, status)
VALUES
-- Admin
('admin1',   '$2a$dummyhash6', 'ADMIN', 'ACTIVE'),

-- Faculty
('faculty1', '$2a$dummyhash4', 'FACULTY', 'ACTIVE'),
('faculty2', '$2a$dummyhash5', 'FACULTY', 'ACTIVE'),
('faculty3', '$2a$dummyhash7', 'FACULTY', 'ACTIVE'),

-- Students
('student1', '$2a$dummyhash1', 'STUDENT', 'ACTIVE'),
('student2', '$2a$dummyhash2', 'STUDENT', 'ACTIVE'),
('student3', '$2a$dummyhash3', 'STUDENT', 'ACTIVE');

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

INSERT INTO admins (
    user_id,
    first_name,
    last_name,
    email,
    mobile,
    gender,
    profile_picture_url
) VALUES
(
    1,
    'System',
    'Admin',
    'admin@example.com',
    '9000000000',
    'OTHER',
    NULL
);

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

INSERT INTO faculties (
    user_id,
    first_name,
    last_name,
    email,
    mobile,
    gender,
    profile_picture_url
) VALUES
(
    2,
    'Pankaj',
    'Jagasia',
    'pankaj.jagasia@example.com',
    '9123456780',
    'MALE',
    NULL
),
(
    3,
    'Eileen',
    'Bartakke',
    'eileen.bartakke@example.com',
    '9123456781',
    'FEMALE',
    NULL
),
(
    4,
    'Vishwanath',
    'K',
    'vishwanath.k@example.com',
    '9123456782',
    'MALE',
    NULL
);

CREATE TABLE students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    -- Batch-Course mapping (student enrolled in a specific batch-course)
    batch_course_id BIGINT NOT NULL,

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

    CONSTRAINT fk_students_batch_course
        FOREIGN KEY (batch_course_id)
        REFERENCES batch_courses(batch_course_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_students_user (user_id),
    INDEX idx_email (email),
    INDEX idx_prn (prn)
) ENGINE=InnoDB;

INSERT INTO students (
    user_id,
    batch_course_id,
    prn,
    first_name,
    last_name,
    email,
    mobile,
    gender,
    profile_picture_url
) VALUES
(
    5,
    1,
    'PRN251001',
    'Aarav',
    'Sharma',
    'aarav.sharma@example.com',
    '9876543210',
    'MALE',
    NULL
),
(
    6,
    2,
    'PRN251002',
    'Riya',
    'Patel',
    'riya.patel@example.com',
    '9876543211',
    'FEMALE',
    NULL
),
(
    7,
    5,
    'PRN252001',
    'Kabir',
    'Mehta',
    'kabir.mehta@example.com',
    '9876543212',
    'MALE',
    NULL
);

-- =====================================================
-- SECTION 3 : FACULTY TEACHING SUBJECTS
-- =====================================================

CREATE TABLE faculty_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    faculty_id BIGINT NOT NULL,

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

    CONSTRAINT fk_fa_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_fa_batch_course_subject
        FOREIGN KEY (batch_course_subject_id)
        REFERENCES batch_course_subjects(batch_course_subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_faculty_bcs
        UNIQUE (faculty_id, batch_course_subject_id),

    INDEX idx_user_id (faculty_id),
    INDEX idx_batch_course_subject_id (batch_course_subject_id)
) ENGINE=InnoDB;

INSERT INTO faculty_assignments
(faculty_id, batch_course_subject_id)
VALUES
-- FEB_2025 — DAC — Effective Communication
(2, 1), (3, 1),

-- FEB_2025 — DAC — Web Based Java Programming
(1, 2),

-- FEB_2025 — DBDA — Effective Communication
(2, 3), (3, 3),

-- FEB_2025 — DTSS — Effective Communication
(2, 4), (3, 4),

-- FEB_2025 — DAI — Effective Communication
(2, 5), (3, 5),

-- AUG_2025 — DAC — Effective Communication
(2, 6), (3, 6),

-- AUG_2025 — DAC — Web Based Java Programming
(1, 7),

-- AUG_2025 — DBDA — Effective Communication
(2, 8), (3, 8),

-- AUG_2025 — DTSS — Effective Communication
(2, 9), (3, 9),

-- AUG_2025 — DAI — Effective Communication
(2, 10), (3, 10);

-- =====================================================
-- SECTION 4 : ASSIGNMENTS
-- =====================================================

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

    CONSTRAINT fk_assignments_bcs
        FOREIGN KEY (batch_course_subject_id)
        REFERENCES batch_course_subjects(batch_course_subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_assignments_created_by
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

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

    CONSTRAINT fk_submissions_student_user
        FOREIGN KEY (student_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_assignment_student
        UNIQUE (assignment_id, student_user_id),

    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_user_id (student_user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

DELIMITER $$
CREATE TRIGGER trg_create_submissions_on_assignment
AFTER INSERT ON assignments
FOR EACH ROW
BEGIN
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
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_set_submitted_at
BEFORE UPDATE ON submissions
FOR EACH ROW
BEGIN
    IF
        OLD.status = 'NOT_SUBMITTED'
        AND NEW.status IN ('SUBMITTED', 'EVALUATED')
        AND NEW.submitted_at IS NULL
    THEN
        SET NEW.submitted_at = CURRENT_TIMESTAMP;
    END IF;
END$$
DELIMITER ;

INSERT INTO assignments (
    batch_course_subject_id,
    created_by_user_id,
    title,
    description,
    file_name,
    file_path,
    mime_type,
    due_date,
    status
) VALUES
-- FEB_2025 – DAC – Effective Communication (bcs_id = 1)

(
    1,
    2,
    'Communication Basics Assignment',
    'Write a short essay explaining the importance of effective communication in professional environments.',
    'ec_comm_basics.pdf',
    '/assignments/ec_comm_basics.pdf',
    'application/pdf',
    '2025-03-15 23:59:59',
    'ACTIVE'
),
(
    1,
    2,
    'Listening Skills Exercise',
    'Prepare a report on active listening techniques with real-life examples.',
    'ec_listening_skills.pdf',
    '/assignments/ec_listening_skills.pdf',
    'application/pdf',
    '2025-03-25 23:59:59',
    'ACTIVE'
),
(
    1,
    2,
    'Presentation Skills Task',
    'Create a 5-minute presentation on a technical topic of your choice.',
    'ec_presentation_skills.pdf',
    '/assignments/ec_presentation_skills.pdf',
    'application/pdf',
    '2025-04-05 23:59:59',
    'ACTIVE'
),
(
    1,
    2,
    'Group Discussion Reflection',
    'Submit a reflection document describing your experience in a group discussion session.',
    'ec_group_discussion.pdf',
    '/assignments/ec_group_discussion.pdf',
    'application/pdf',
    '2025-04-15 23:59:59',
    'ACTIVE'
),

-- FEB_2025 – DAC – Web Based Java Programming (bcs_id = 2)

(
    2,
    2,
    'Servlet Basics Assignment',
    'Implement a basic servlet that handles GET and POST requests.',
    'wbjp_servlet_basics.pdf',
    '/assignments/wbjp_servlet_basics.pdf',
    'application/pdf',
    '2025-03-20 23:59:59',
    'ACTIVE'
),
(
    2,
    2,
    'JSP Form Handling Task',
    'Create a JSP-based form and process user input on the server side.',
    'wbjp_jsp_forms.pdf',
    '/assignments/wbjp_jsp_forms.pdf',
    'application/pdf',
    '2025-04-10 23:59:59',
    'ACTIVE'
);

-- =====================================================
-- SECTION 4 : AUTOMATIC ACCOUNT DELETION
-- =====================================================

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

SHOW EVENTS;

INSERT INTO users (
    username,
    password_hash,
    role,
    created_at,
    updated_at
) 
VALUES (
    'old_user_01',
    '$2a$dummyOldHash',
    'STUDENT',
    CURRENT_TIMESTAMP - INTERVAL 8 MONTH,
    CURRENT_TIMESTAMP - INTERVAL 8 MONTH
);

SELECT
    user_id,
    username,
    role,
    created_at,
    status
FROM users
WHERE status != 'INACTIVE'
AND created_at < CURRENT_TIMESTAMP - INTERVAL 6 MONTH;

SELECT * FROM users;
SELECT * FROM admins;


