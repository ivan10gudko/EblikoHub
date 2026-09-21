DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_room_titles_added_by_user' 
          AND table_name = 'room_titles'
    ) THEN
        ALTER TABLE room_titles 
            ADD CONSTRAINT fk_room_titles_added_by_user 
            FOREIGN KEY (added_by_user_id) 
            REFERENCES users(user_id) 
            ON DELETE CASCADE 
            NOT VALID;

        ALTER TABLE room_titles 
            VALIDATE CONSTRAINT fk_room_titles_added_by_user;
    END IF;
END $$;