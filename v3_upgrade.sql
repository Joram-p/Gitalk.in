USE linguafree;
CREATE TABLE IF NOT EXISTS languages (
 id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(12) NOT NULL UNIQUE,
 name VARCHAR(80) NOT NULL,
 native_name VARCHAR(100) NOT NULL,
 flag_emoji VARCHAR(12) DEFAULT '🌐',
 speech_locale VARCHAR(20) NOT NULL,
 is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS v3_lesson_meta (
 lesson_id BIGINT UNSIGNED PRIMARY KEY,
 language_code VARCHAR(12) NOT NULL,
 unit_number SMALLINT UNSIGNED NOT NULL,
 skill_focus ENUM('Vocabulary','Grammar','Listening','Speaking','Reading','Writing','Review') NOT NULL,
 cefr_level ENUM('Pre-A1','A1','A2','B1','B2','C1') NOT NULL DEFAULT 'A1',
 FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
 INDEX idx_lesson_language_unit(language_code,unit_number)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS ai_conversations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 language_code VARCHAR(12) NOT NULL,
 level VARCHAR(20) NOT NULL DEFAULT 'A1',
 topic VARCHAR(120) DEFAULT 'Daily conversation',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_ai_user_updated(user_id,updated_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS ai_messages (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 conversation_id BIGINT UNSIGNED NOT NULL,
 role ENUM('user','assistant') NOT NULL,
 content TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE,
 INDEX idx_ai_messages_conversation(conversation_id,id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS pronunciation_assessments (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 language_code VARCHAR(12) NOT NULL,
 reference_text TEXT NOT NULL,
 transcript TEXT NOT NULL,
 score TINYINT UNSIGNED NOT NULL DEFAULT 0,
 assessment_type ENUM('provider_audio','ai_transcript','text_similarity') NOT NULL DEFAULT 'text_similarity',
 feedback TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_pronunciation_user(user_id,created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS certificate_credentials (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 certificate_id BIGINT UNSIGNED NOT NULL UNIQUE,
 credential_version VARCHAR(20) NOT NULL DEFAULT 'LinguaFree-1.0',
 credential_hash CHAR(64) NOT NULL,
 verification_url VARCHAR(500) NOT NULL,
 revoked_at DATETIME DEFAULT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE,
 INDEX idx_credential_hash(credential_hash)
) ENGINE=InnoDB;
