

DROP DATABASE IF EXISTS campusdb;
CREATE DATABASE campusdb;
USE campusdb;

-- =====================================================
-- SECTION 1 : ACADEMIC MASTER & NORMALIZATION
-- =====================================================

-- 1. Master Tables
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    CONSTRAINT uq_course_name UNIQUE (course_name)
) ENGINE=InnoDB;

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_subject_name UNIQUE (subject_name)
) ENGINE=InnoDB;

CREATE TABLE batches (
    batch_id INT PRIMARY KEY,
    batch_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT chk_batch_dates CHECK (end_date > start_date)
) ENGINE=InnoDB;

-- 2. Link Batch and Course (Forms the BC_ID)
CREATE TABLE batch_courses (
    bc_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bc_batch
        FOREIGN KEY (batch_id)
        REFERENCES batches(batch_id),

    CONSTRAINT fk_bc_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    CONSTRAINT uq_batch_course
        UNIQUE (batch_id, course_id)
) ENGINE=InnoDB;

-- 3. Link Subject to the Batch-Course (Forms the BCS_ID)
CREATE TABLE batch_course_subjects (
    bcs_id INT AUTO_INCREMENT PRIMARY KEY,
    bc_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bcs_bc
        FOREIGN KEY (bc_id)
        REFERENCES batch_courses(bc_id),

    CONSTRAINT fk_bcs_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id),

    CONSTRAINT uq_bc_subject
        UNIQUE (bc_id, subject_id)
) ENGINE=InnoDB;

CREATE INDEX idx_batch_courses_batch ON batch_courses(batch_id);
CREATE INDEX idx_batch_courses_course ON batch_courses(course_id);

CREATE INDEX idx_bcs_bc ON batch_course_subjects(bc_id);
CREATE INDEX idx_bcs_subject ON batch_course_subjects(subject_id);

-- Seed Data

INSERT INTO courses (course_name) VALUES 
('DAC'),
('DBDA'),
('DTSS'),
('DAI');

INSERT INTO subjects (subject_name) VALUES 
('Effective communication'),
('Aptitude'),
('ADS using Java'),
('C++ Programming'),
('COSSDM-COS'),
('COSSDM-Git, DevOps'),
('COSSDM-SDM'),
('COSSDM-Testing'),
('DBT'),
('OOP with Java'),
('Web Based Java Programming'),
('Web Programming Technologies');

INSERT INTO batches (batch_id, batch_name, start_date, end_date) VALUES 
(251, 'feb25', '2025-02-04', '2025-08-22'),
(252, 'aug25', '2025-08-22', '2026-02-04');

SELECT * FROM courses ORDER BY course_id;
SELECT * FROM subjects ORDER BY subject_id;
SELECT * FROM batches ORDER BY batch_id;

-- entering data into normalization table 1: batch_course

INSERT INTO batch_courses (batch_id, course_id) VALUES 
-- Feb25 Combinations
(251, 1), -- feb25 - DAC
(251, 2), -- feb25 - DBDA
(251, 3), -- feb25 - DTSS
(251, 4), -- feb25 - DAI

-- Aug25 Combinations
(252, 1), -- aug25 - DAC
(252, 2), -- aug25 - DBDA
(252, 3), -- aug25 - DTSS
(252, 4); -- aug25 - DAI

SELECT bc.bc_id, b.batch_name, c.course_name 
FROM batch_courses bc
JOIN batches b ON bc.batch_id = b.batch_id
JOIN courses c ON bc.course_id = c.course_id
ORDER BY b.batch_id, c.course_id;

-- entering data into normalization table 2 : batch_course_subject

INSERT INTO batch_course_subjects (bc_id, subject_id) VALUES 
-- Batch: feb25 (BC IDs 1-4)
(1, 1),  -- DAC: Effective communication
(1, 11), -- DAC: Web Based Java Programming (Extra)
(2, 1),  -- DBDA: Effective communication
(3, 1),  -- DTSS: Effective communication
(4, 1),  -- DAI: Effective communication

-- Batch: aug25 (BC IDs 5-8)
(5, 1),  -- DAC: Effective communication
(5, 11), -- DAC: Web Based Java Programming (Extra)
(6, 1),  -- DBDA: Effective communication
(7, 1),  -- DTSS: Effective communication
(8, 1);  -- DAI: Effective communication

SELECT 
    bcs.bcs_id,
    bc.bc_id,
    b.batch_name,
    c.course_name,
    s.subject_name
FROM batch_course_subjects bcs
JOIN batch_courses bc ON bcs.bc_id = bc.bc_id
JOIN batches b ON bc.batch_id = b.batch_id
JOIN courses c ON bc.course_id = c.course_id
JOIN subjects s ON bcs.subject_id = s.subject_id
ORDER BY bc.bc_id, s.subject_id;

-- =====================================================
-- SECTION 2 : ACCOUNTS & PROFILES
-- =====================================================

CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),

    CONSTRAINT fk_admins_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE faculties (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),

    CONSTRAINT fk_faculties_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    bc_id INT NOT NULL,
    prn VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    
    CONSTRAINT fk_students_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_students_bc
        FOREIGN KEY (bc_id)
        REFERENCES batch_courses(bc_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_accounts_role ON accounts(role);
CREATE INDEX idx_students_account ON students(account_id);
CREATE INDEX idx_faculties_account ON faculties(account_id);
CREATE INDEX idx_admins_account ON admins(account_id);

-- seed data

INSERT INTO accounts (username, password_hash, role) VALUES
-- Admin
('admin1', '$2a$dummyhash6', 'ADMIN'),

-- Faculty
('faculty1', '$2a$dummyhash4', 'FACULTY'),
('faculty2', '$2a$dummyhash5', 'FACULTY'),
('faculty3', '$2a$dummyhash7', 'FACULTY'),

-- Students
('student1', '$2a$dummyhash1', 'STUDENT'),
('student2', '$2a$dummyhash2', 'STUDENT'),
('student3', '$2a$dummyhash3', 'STUDENT');

INSERT INTO admins (
    account_id, name, email, phone, gender
) VALUES
(1, 'System Admin', 'admin@example.com', '9000000000', 'OTHER');

INSERT INTO faculties (
    account_id, name, email, phone, gender
) VALUES
(2, 'Mr. Pankaj Jagasia', 'pankaj.jagasia@example.com', '9123456780', 'MALE'),
(3, 'Ms. Eileen Bartakke', 'eileen.bartakke@example.com', '9123456781', 'FEMALE'),
(4, 'Mr. Vishwanath K', 'vishwanath.k@example.com', '9123456782', 'MALE');

INSERT INTO students (
    account_id, bc_id, prn, name, email, phone, gender
) VALUES
(5, 1, 'PRN251001', 'Aarav Sharma', 'aarav.sharma@example.com', '9876543210', 'MALE'),
(6, 2, 'PRN251002', 'Riya Patel', 'riya.patel@example.com', '9876543211', 'FEMALE'),
(7, 5, 'PRN252001', 'Kabir Mehta', 'kabir.mehta@example.com', '9876543212', 'MALE');

SELECT * FROM accounts;
SELECT * FROM admins;
SELECT * FROM faculties;
SELECT * FROM students;

SELECT 
    s.name,
    s.prn,
    b.batch_name,
    c.course_name
FROM students s
JOIN batch_courses bc ON s.bc_id = bc.bc_id
JOIN batches b ON bc.batch_id = b.batch_id
JOIN courses c ON bc.course_id = c.course_id;

-- =====================================================
-- SECTION 3 : FACULTY TEACHING SUBJECTS
-- =====================================================

-- Link Faculties to the Batch-Course-Subject
CREATE TABLE batch_course_subject_faculties (
    bcs_id INT NOT NULL,
    faculty_id INT NOT NULL,

    CONSTRAINT pk_bcs_faculty
        PRIMARY KEY (bcs_id, faculty_id),

    CONSTRAINT fk_bcsf_bcs
        FOREIGN KEY (bcs_id)
        REFERENCES batch_course_subjects(bcs_id),

    CONSTRAINT fk_bcsf_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculties(faculty_id)
) ENGINE=InnoDB;

CREATE INDEX idx_bcs_faculty_faculty ON batch_course_subject_faculties(faculty_id);

-- entering data into normalization table 3 : batch_course_subject_faculties

INSERT INTO batch_course_subject_faculties (bcs_id, faculty_id) VALUES 
-- bcs_id 1 (feb25-DAC-Effective comm): Assigned to Faculty 2 & 3
(1, 2), (1, 3),
-- bcs_id 2 (feb25-DAC-Web Based Java): Assigned to Faculty 1
(2, 1),
-- bcs_id 3 (feb25-DBDA-Effective comm): Assigned to Faculty 2 & 3
(3, 2), (3, 3),
-- bcs_id 4 (feb25-DTSS-Effective comm): Assigned to Faculty 2 & 3
(4, 2), (4, 3),
-- bcs_id 5 (feb25-DAI-Effective comm): Assigned to Faculty 2 & 3
(5, 2), (5, 3),
-- bcs_id 6 (aug25-DAC-Effective comm): Assigned to Faculty 2 & 3
(6, 2), (6, 3),
-- bcs_id 7 (aug25-DAC-Web Based Java): Assigned to Faculty 1
(7, 1),
-- bcs_id 8 (aug25-DBDA-Effective comm): Assigned to Faculty 2 & 3
(8, 2), (8, 3),
-- bcs_id 9 (aug25-DTSS-Effective comm): Assigned to Faculty 2 & 3
(9, 2), (9, 3),
-- bcs_id 10 (aug25-DAI-Effective comm): Assigned to Faculty 2 & 3
(10, 2), (10, 3);

SELECT 
    b.batch_name,
    c.course_name,
    s.subject_name,
    f.name AS faculty_name
FROM batches b
JOIN batch_courses bc ON b.batch_id = bc.batch_id
JOIN courses c ON bc.course_id = c.course_id
JOIN batch_course_subjects bcs ON bc.bc_id = bcs.bc_id
JOIN subjects s ON bcs.subject_id = s.subject_id
JOIN batch_course_subject_faculties bcsf ON bcs.bcs_id = bcsf.bcs_id
JOIN faculties f ON bcsf.faculty_id = f.faculty_id
ORDER BY b.batch_id, c.course_id, s.subject_id;

-- =====================================================
-- SECTION 4 : ASSIGNMENTS
-- =====================================================

CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    bcs_id INT NOT NULL,
    
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    attachment_url VARCHAR(500) NOT NULL,
    due_date DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignments_bcs
        FOREIGN KEY (bcs_id)
        REFERENCES batch_course_subjects(bcs_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assignment_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,

    assignment_id INT NOT NULL,
    student_id INT NOT NULL,

    submission_url VARCHAR(500),
    submitted_at DATETIME,

    grade TINYINT,
    remarks TEXT,

    status ENUM(
        'NOT_SUBMITTED',
        'SUBMITTED',
        'LATE',
        'EVALUATED'
    ) DEFAULT 'NOT_SUBMITTED',

    CONSTRAINT fk_submission_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_submission_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_assignment_student
        UNIQUE (assignment_id, student_id),

    CONSTRAINT chk_grade_range
        CHECK (grade BETWEEN 0 AND 10)
) ENGINE=InnoDB;

CREATE INDEX idx_assignments_bcs ON assignments(bcs_id);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);

DELIMITER $$
CREATE TRIGGER trg_create_assignment_submissions
AFTER INSERT ON assignments
FOR EACH ROW
BEGIN
    INSERT INTO assignment_submissions (
        assignment_id,
        student_id,
        status
    )
    SELECT
        NEW.assignment_id,
        s.student_id,
        'NOT_SUBMITTED'
    FROM students s
    JOIN batch_course_subjects bcs
        ON bcs.bcs_id = NEW.bcs_id
    WHERE s.bc_id = bcs.bc_id;
END$$
DELIMITER ;

INSERT INTO assignments (
    bcs_id,
    title,
    description,
    attachment_url,
    due_date
) VALUES
-- 4 assignments for bcs_id = 1 (feb25 - DAC - Effective communication)
(1, 
 'Communication Basics Assignment',
 'Write a short essay explaining the importance of effective communication in professional environments.',
 'https://cloud.example.com/assignments/ec_comm_basics.pdf',
 '2025-03-15 23:59:59'),

(1,
 'Listening Skills Exercise',
 'Prepare a report on active listening techniques with real-life examples.',
 'https://cloud.example.com/assignments/ec_listening_skills.pdf',
 '2025-03-25 23:59:59'),

(1,
 'Presentation Skills Task',
 'Create a 5-minute presentation on a technical topic of your choice.',
 'https://cloud.example.com/assignments/ec_presentation_skills.pdf',
 '2025-04-05 23:59:59'),

(1,
 'Group Discussion Reflection',
 'Submit a reflection document describing your experience in a group discussion session.',
 'https://cloud.example.com/assignments/ec_group_discussion.pdf',
 '2025-04-15 23:59:59'),

-- 2 assignments for bcs_id = 2 (feb25 - DAC - Web Based Java Programming)
(2,
 'Servlet Basics Assignment',
 'Implement a basic servlet that handles GET and POST requests.',
 'https://cloud.example.com/assignments/wbjp_servlet_basics.pdf',
 '2025-03-20 23:59:59'),
 
 (2,
 'JSP Form Handling Task',
 'Create a JSP-based form and process user input on the server side.',
 'https://cloud.example.com/assignments/wbjp_jsp_forms.pdf',
 '2025-04-10 23:59:59');

SELECT 
    a.assignment_id,
    b.batch_name,
    c.course_name,
    s.subject_name,
    a.title,
    a.due_date
FROM assignments a
JOIN batch_course_subjects bcs ON a.bcs_id = bcs.bcs_id
JOIN batch_courses bc ON bcs.bc_id = bc.bc_id
JOIN batches b ON bc.batch_id = b.batch_id
JOIN courses c ON bc.course_id = c.course_id
JOIN subjects s ON bcs.subject_id = s.subject_id
ORDER BY a.bcs_id, a.assignment_id;

 select * from assignment_submissions;