
CREATE INDEX IF NOT EXISTS idx_room_titles_room_id
ON room_titles(room_id);

CREATE INDEX IF NOT EXISTS idx_rating_title_id 
ON title_ratings(title_id);


CREATE INDEX IF NOT EXISTS idx_user_records_status 
ON titles(status);

CREATE INDEX IF NOT EXISTS idx_user_records_title_user_status 
ON titles(user_id, title_id, status);

CREATE INDEX IF NOT EXISTS idx_room_requests_sender_id 
ON room_requests(sender_id, status, type);

CREATE INDEX IF NOT EXISTS idx_room_requests_user_id 
ON room_requests(user_id, status, type);