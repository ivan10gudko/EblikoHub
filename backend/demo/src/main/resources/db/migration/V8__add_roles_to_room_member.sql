ALTER TABLE room_members ADD COLUMN role VARCHAR(20) DEFAULT 'MEMBER';

UPDATE room_members 
SET role = 'OWNER' 
WHERE type = 'OWNER';

UPDATE room_members 
SET role = 'MEMBER' 
WHERE type != 'OWNER' OR type IS NULL;

ALTER TABLE room_members ALTER COLUMN role SET NOT NULL;

ALTER TABLE room_members 
ADD CONSTRAINT check_room_role_enum 
CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER'));