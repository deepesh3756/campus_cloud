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

/*
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
*/

/*
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
*/

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

