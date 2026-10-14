
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_room_title_mal_id'
    ) THEN
DELETE FROM room_titles a USING room_titles b
WHERE a.ctid < b.ctid
  AND a.room_id = b.room_id
  AND a.api_title_id = b.api_title_id;

ALTER TABLE room_titles
    ADD CONSTRAINT uk_room_title_mal_id UNIQUE (room_id, api_title_id);
END IF;
END $$;