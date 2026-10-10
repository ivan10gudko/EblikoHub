DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='role') THEN
        ALTER TABLE room_members ADD COLUMN role VARCHAR(20) DEFAULT 'MEMBER';
        
        UPDATE room_members SET role = 'OWNER' WHERE type = 'OWNER';
        UPDATE room_members SET role = 'MEMBER' WHERE (type != 'OWNER' OR type IS NULL);
        
        ALTER TABLE room_members ALTER COLUMN role SET NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name='check_room_role_enum') THEN
        ALTER TABLE room_members ADD CONSTRAINT check_room_role_enum CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER'));
    END IF;
END $$;