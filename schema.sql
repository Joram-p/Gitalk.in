CREATE DATABASE IF NOT EXISTS linguafree CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linguafree;

CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student',
 preferred_language ENUM('en','hi') NOT NULL DEFAULT 'en',
 status ENUM('active','suspended') NOT NULL DEFAULT 'active',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 language_name VARCHAR(100) NOT NULL,
 language_code VARCHAR(12) NOT NULL,
 native_name VARCHAR(100) DEFAULT NULL,
 flag_emoji VARCHAR(12) DEFAULT '🌐',
 level ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
 description TEXT,
 teacher_id BIGINT UNSIGNED DEFAULT NULL,
 is_published TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
 INDEX idx_course_public (is_published, language_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lessons (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 course_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(180) NOT NULL,
 lesson_order INT UNSIGNED NOT NULL DEFAULT 1,
 content LONGTEXT,
 video_url VARCHAR(500) DEFAULT NULL,
 audio_url VARCHAR(500) DEFAULT NULL,
 duration_minutes SMALLINT UNSIGNED DEFAULT 5,
 is_published TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_lesson_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
 INDEX idx_lesson_order (course_id, lesson_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quizzes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lesson_id BIGINT UNSIGNED NOT NULL,
 question TEXT NOT NULL,
 option_a VARCHAR(500) NOT NULL,
 option_b VARCHAR(500) NOT NULL,
 option_c VARCHAR(500) NOT NULL,
 option_d VARCHAR(500) NOT NULL,
 correct_option ENUM('a','b','c','d') NOT NULL,
 explanation TEXT,
 CONSTRAINT fk_quiz_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enrollments (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 course_id BIGINT UNSIGNED NOT NULL,
 enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_enrollment (user_id, course_id),
 CONSTRAINT fk_enroll_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lesson_progress (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 lesson_id BIGINT UNSIGNED NOT NULL,
 completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_progress (user_id, lesson_id),
 CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quiz_attempts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 quiz_id BIGINT UNSIGNED NOT NULL,
 selected_option ENUM('a','b','c','d') NOT NULL,
 is_correct TINYINT(1) NOT NULL,
 attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 course_id BIGINT UNSIGNED NOT NULL,
 certificate_code VARCHAR(40) NOT NULL UNIQUE,
 issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_certificate (user_id, course_id),
 CONSTRAINT fk_cert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_cert_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS announcements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 body TEXT NOT NULL,
 created_by BIGINT UNSIGNED DEFAULT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_announcement_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Initial public course catalogue. Add full lesson content from the teacher dashboard.
INSERT INTO courses (title,language_name,language_code,native_name,flag_emoji,level,description,is_published)
SELECT * FROM (
 SELECT 'English for Everyday Life','English','en','English','🇬🇧','Beginner','Build confidence with greetings, everyday vocabulary and simple conversations.',1 UNION ALL
 SELECT 'Hindi Foundations','Hindi','hi','हिन्दी','🇮🇳','Beginner','Learn Hindi words, useful phrases and basic sentence patterns.',1 UNION ALL
 SELECT 'Spanish Starter','Spanish','es','Español','🇪🇸','Beginner','Start Spanish with greetings, pronunciation and daily expressions.',1 UNION ALL
 SELECT 'French Essentials','French','fr','Français','🇫🇷','Beginner','Learn practical French vocabulary and polite conversation.',1 UNION ALL
 SELECT 'German Basics','German','de','Deutsch','🇩🇪','Beginner','Build a foundation in German vocabulary and grammar.',1 UNION ALL
 SELECT 'Japanese Starter','Japanese','ja','日本語','🇯🇵','Beginner','Explore greetings, hiragana and useful Japanese phrases.',1 UNION ALL
 SELECT 'Korean Basics','Korean','ko','한국어','🇰🇷','Beginner','Begin with Hangul, greetings and everyday Korean.',1 UNION ALL
 SELECT 'Mandarin Chinese','Chinese','zh','中文','🇨🇳','Beginner','Start Mandarin with pinyin, tones and essential words.',1 UNION ALL
 SELECT 'Arabic Foundations','Arabic','ar','العربية','🇸🇦','Beginner','Discover Arabic script and common expressions.',1 UNION ALL
 SELECT 'Italian for Beginners','Italian','it','Italiano','🇮🇹','Beginner','Practice Italian phrases for travel and daily life.',1 UNION ALL
 SELECT 'Portuguese Starter','Portuguese','pt','Português','🇧🇷','Beginner','Learn Portuguese greetings and practical expressions.',1 UNION ALL
 SELECT 'Russian Foundations','Russian','ru','Русский','🇷🇺','Beginner','Explore Cyrillic and beginner Russian conversation.',1
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM courses LIMIT 1);
