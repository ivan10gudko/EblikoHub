DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wheel_current_titles' AND column_name = 'multiplier'
    ) THEN
        ALTER TABLE wheel_current_titles ADD COLUMN multiplier INT NOT NULL DEFAULT 1;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'wheel_preset_titles' AND column_name = 'multiplier'
    ) THEN
        ALTER TABLE wheel_preset_titles ADD COLUMN multiplier INT NOT NULL DEFAULT 1;
    END IF;
END $$;
