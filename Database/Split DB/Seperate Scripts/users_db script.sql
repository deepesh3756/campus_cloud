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

INSERT INTO students (
    user_id,
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
    'PRN252001',
    'Kabir',
    'Mehta',
    'kabir.mehta@example.com',
    '9876543212',
    'MALE',
    NULL
);

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
