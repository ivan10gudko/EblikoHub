
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE room_members DROP CONSTRAINT IF EXISTS room_members_type_check;
ALTER TABLE room_members ADD CONSTRAINT room_members_type_check 
CHECK (type IN ('JOIN_REQUEST', 'INVITE', 'OWNER'));

INSERT INTO room_members (id, room_id, user_id, sender_id, status, type, created_at, is_pinned)
SELECT 
    gen_random_uuid(),
    r.room_id, 
    r.owner_id, 
    r.owner_id, 
    'ACCEPTED', 
    'OWNER',   
    CURRENT_TIMESTAMP,
    COALESCE(r.is_pinned, FALSE)
FROM rooms r
WHERE NOT EXISTS (
    SELECT 1 
    FROM room_members rm 
    WHERE rm.room_id = r.room_id 
    AND rm.user_id = r.owner_id
);
UPDATE room_members rm
SET is_pinned = r.is_pinned
FROM rooms r
WHERE rm.room_id = r.room_id
AND rm.user_id = r.owner_id
AND r.is_pinned = TRUE;

ALTER TABLE rooms DROP COLUMN IF EXISTS is_pinned;