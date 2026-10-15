DO
$$
BEGIN
    IF
EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_room_title_mal_id'
    ) THEN
ALTER TABLE room_titles DROP CONSTRAINT uk_room_title_mal_id;
END IF;


IF
NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_room_title_unique_api_id'
    ) THEN
CREATE UNIQUE INDEX idx_room_title_unique_api_id
    ON room_titles (room_id, api_title_id) WHERE api_title_id IS NOT NULL;
END IF;
END $$;