ALTER TABLE rooms ADD COLUMN IF NOT EXISTS description VARCHAR(255);

CREATE TABLE IF NOT EXISTS room_titles (
    id UUID PRIMARY KEY,
    room_id BIGINT NOT NULL,
    title_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    title_type VARCHAR(50) NOT NULL DEFAULT 'ANIME',
    api_title_id BIGINT,
    added_by_user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_titles_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    CONSTRAINT check_title_type_enum CHECK (title_type IN ('ANIME', 'HENTAI', 'MANGA', 'MOVIE', 'SERIES'))
);

CREATE TABLE IF NOT EXISTS room_title_links (
    id UUID PRIMARY KEY,
    user_title_record_id BIGINT NOT NULL,
    room_title_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_record_room_title UNIQUE (user_title_record_id, room_title_id),
    CONSTRAINT fk_link_user_record FOREIGN KEY (user_title_record_id) REFERENCES titles(title_id) ON DELETE CASCADE,
    CONSTRAINT fk_link_room_title FOREIGN KEY (room_title_id) REFERENCES room_titles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room_bans (
    id UUID PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    banned_by_user_id UUID,
    reason VARCHAR(255), 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_room_user_ban UNIQUE (room_id, user_id),
    CONSTRAINT fk_ban_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    CONSTRAINT fk_ban_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_banned_by_user_id FOREIGN KEY (banned_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_room_titles_room_id ON room_titles(room_id);
CREATE INDEX IF NOT EXISTS idx_room_title_links_room_title_id ON room_title_links(room_title_id);
CREATE INDEX IF NOT EXISTS idx_room_bans_room_id ON room_bans(room_id);