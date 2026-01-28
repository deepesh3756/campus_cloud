DROP DATABASE IF EXISTS academic_db;
CREATE DATABASE academic_db;
USE academic_db;

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
        
	/*
    CONSTRAINT fk_fa_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	*/

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
