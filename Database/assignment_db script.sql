-- =====================================================
-- DATABASE: assignment_db
-- PURPOSE: Assignments, submissions, and evaluations
-- =====================================================

DROP DATABASE IF EXISTS assignment_db;
CREATE DATABASE assignment_db;
USE assignment_db;

-- =====================================================
-- ASSIGNMENTS
-- =====================================================

CREATE TABLE assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- batch_course_subject_id references academic_db
    -- NO foreign key constraint (microservices boundary)
    batch_course_subject_id BIGINT NOT NULL,

    -- created_by_user_id references users_db
    -- NO foreign key constraint (microservices boundary)
    created_by_user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_path VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    due_date DATETIME NOT NULL,

    max_file_size_mb INT DEFAULT 10,

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

    INDEX idx_batch_course_subject_id (batch_course_subject_id),
    INDEX idx_created_by (created_by_user_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- SUBMISSIONS
-- =====================================================

CREATE TABLE submissions (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    assignment_id BIGINT NOT NULL,

    -- student_user_id references users_db
    -- NO foreign key constraint (microservices boundary)
    student_user_id BIGINT NOT NULL,

    file_name VARCHAR(255) NULL,

    file_path VARCHAR(500) NULL,

    file_size_bytes BIGINT NULL,

    mime_type VARCHAR(100) NULL,

    submitted_at TIMESTAMP NULL,

    status ENUM('PENDING', 'SUBMITTED', 'EVALUATED')
        NOT NULL
        DEFAULT 'PENDING',

    CONSTRAINT fk_submissions_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_assignment_student
        UNIQUE (assignment_id, student_user_id),

    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_user_id (student_user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- EVALUATIONS
-- =====================================================

CREATE TABLE evaluations (
    evaluation_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    submission_id BIGINT NOT NULL UNIQUE,

    -- evaluated_by_user_id references users_db
    -- NO foreign key constraint (microservices boundary)
    evaluated_by_user_id BIGINT NOT NULL,

    grade INT
        NOT NULL
        CHECK (grade BETWEEN 1 AND 10),

    remarks TEXT NULL,

    evaluated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evaluations_submission
        FOREIGN KEY (submission_id)
        REFERENCES submissions(submission_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_submission_id (submission_id),
    INDEX idx_evaluated_by (evaluated_by_user_id)
) ENGINE=InnoDB;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Auto-set submitted_at timestamp
DELIMITER $$
CREATE TRIGGER trg_set_submitted_at
BEFORE UPDATE ON submissions
FOR EACH ROW
BEGIN
    IF
        OLD.status = 'PENDING'
        AND NEW.status IN ('SUBMITTED', 'EVALUATED')
        AND NEW.submitted_at IS NULL
    THEN
        SET NEW.submitted_at = CURRENT_TIMESTAMP;
    END IF;
END$$
DELIMITER ;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

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
-- Assignments for batch_course_subject_id = 1 (FEB_2025 - DAC - Effective Communication)
(
    1,
    2, -- Created by faculty user_id=2
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

-- Assignments for batch_course_subject_id = 2 (FEB_2025 - DAC - Web Based Java Programming)
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

-- Sample submissions (initially PENDING)
INSERT INTO submissions (
    assignment_id,
    student_user_id,
    status
) VALUES
-- Student 5 (Aarav) submissions for assignment 1
(1, 5, 'PENDING'),
(2, 5, 'PENDING'),
(3, 5, 'PENDING'),
(4, 5, 'PENDING');