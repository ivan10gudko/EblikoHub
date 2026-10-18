DO
$$
BEGIN
UPDATE titles
SET title_type = 'ANIME'
WHERE title_type = 'SERIES';
ALTER TABLE titles DROP CONSTRAINT IF EXISTS titles_title_type_check;
ALTER TABLE titles DROP CONSTRAINT IF EXISTS check_title_type_enum;

ALTER TABLE titles
    ADD CONSTRAINT check_title_type_enum
        CHECK (title_type IN ('ANIME', 'HENTAI', 'MANGA', 'MOVIE'));


UPDATE room_titles
SET title_type = 'ANIME'
WHERE title_type = 'SERIES';

ALTER TABLE room_titles DROP CONSTRAINT IF EXISTS room_titles_title_type_check;
ALTER TABLE room_titles DROP CONSTRAINT IF EXISTS check_title_type_enum;
ALTER TABLE room_titles
    ADD CONSTRAINT check_title_type_enum
        CHECK (title_type IN ('ANIME', 'HENTAI', 'MANGA', 'MOVIE'));

END $$;