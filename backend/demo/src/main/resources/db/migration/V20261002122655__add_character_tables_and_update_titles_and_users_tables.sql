DO
$$
BEGIN
    IF
NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'characters'
    ) THEN
CREATE TABLE characters
(
    id           UUID PRIMARY KEY,
    user_id      UUID         NOT NULL,
    api_title_id INT,
    name         VARCHAR(255) NOT NULL,
    image_url    TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_characters_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
END IF;

    IF
NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'titles'
        AND column_name = 'character_id'
    ) THEN
ALTER TABLE titles
    ADD COLUMN character_id UUID;

ALTER TABLE titles
    ADD CONSTRAINT fk_titles_character
        FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE SET NULL;
END IF;

    IF
NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_favorite_character'
    ) THEN
CREATE TABLE user_favorite_character
(
    id           UUID PRIMARY KEY,
    user_id      UUID      NOT NULL,
    character_id UUID      NOT NULL,
    position     INT       NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ufc_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ufc_character FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE
);
END IF;

END $$;