USE linguafree;
CREATE TABLE IF NOT EXISTS speaking_attempts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 language_code VARCHAR(12) NOT NULL,
 prompt_text VARCHAR(500) NOT NULL,
 transcript TEXT NOT NULL,
 score TINYINT UNSIGNED NOT NULL DEFAULT 0,
 feedback TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_speaking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_speaking_user_date (user_id, created_at)
) ENGINE=InnoDB;

-- The original schema already creates certificates with a unique certificate_code
-- and a unique user/course pair. This migration adds a verification lookup index.
CREATE INDEX idx_certificate_code ON certificates(certificate_code);
