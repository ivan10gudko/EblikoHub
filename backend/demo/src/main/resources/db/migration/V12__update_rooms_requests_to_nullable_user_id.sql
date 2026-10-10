
ALTER TABLE room_requests ALTER COLUMN user_id DROP NOT NULL;

UPDATE room_requests
SET user_id = NULL
WHERE type = 'JOIN_REQUEST' AND user_id = sender_id;