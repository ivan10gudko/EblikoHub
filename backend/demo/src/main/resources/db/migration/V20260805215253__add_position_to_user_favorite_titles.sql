DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_favorite_titles' 
        AND column_name = 'position'
    ) THEN
        ALTER TABLE user_favorite_titles
        ADD COLUMN position INT NOT NULL DEFAULT 1;
    END IF;
END $$;