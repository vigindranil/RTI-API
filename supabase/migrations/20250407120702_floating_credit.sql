-- Create error log table
CREATE TABLE IF NOT EXISTS error_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    procedure_name VARCHAR(255) NOT NULL,
    error_message TEXT NOT NULL,
    error_code INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rename existing error log table if it exists with a different name
RENAME TABLE IF EXISTS errorlogtable TO error_log;

-- Add error_code column if it doesn't exist
ALTER TABLE error_log 
ADD COLUMN IF NOT EXISTS error_code INT AFTER error_message;

-- Update stored procedures to use consistent error logging
DELIMITER $$

-- Update error handlers in stored procedures
DROP PROCEDURE IF EXISTS InsertState$$
CREATE PROCEDURE `InsertState`(
    IN in_state_name VARCHAR(255),
    IN in_user_id INT,
    OUT error_code INT
)
BEGIN
    DECLARE err_msg TEXT;
    DECLARE err_code INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            err_msg = MESSAGE_TEXT,
            err_code = MYSQL_ERRNO;
        
        INSERT INTO error_log (procedure_name, error_message, error_code) 
        VALUES('InsertState', err_msg, err_code);
        
        SET error_code = err_code;
    END;

    INSERT INTO state (
        state_name,
        is_delete,
        createdAt,
        UpdatedAt,
        user_id
    ) VALUES (
        in_state_name,
        0,
        NOW(6),
        NOW(6),
        in_user_id
    );

    SET error_code = 0;
END$$

-- Update other stored procedures similarly...
DELIMITER ;