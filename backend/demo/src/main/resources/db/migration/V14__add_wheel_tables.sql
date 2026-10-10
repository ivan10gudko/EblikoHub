CREATE TABLE IF NOT EXISTS wheel_current_settings (
    user_id UUID PRIMARY KEY,
    mode VARCHAR(50) NOT NULL,
    spin_duration INTEGER NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_current_settings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wheel_current_titles (
    user_id UUID NOT NULL,
    title_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, title_id),
    CONSTRAINT fk_current_titles_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_current_titles_title FOREIGN KEY (title_id) REFERENCES titles(title_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wheel_presets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    mode VARCHAR(50) NOT NULL,
    spin_duration INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_presets_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_preset_name UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS wheel_preset_titles (
    preset_id UUID NOT NULL,
    title_id BIGINT NOT NULL,
    PRIMARY KEY (preset_id, title_id),
    CONSTRAINT fk_preset_titles_preset FOREIGN KEY (preset_id) REFERENCES wheel_presets(id) ON DELETE CASCADE,
    CONSTRAINT fk_preset_titles_title FOREIGN KEY (title_id) REFERENCES titles(title_id) ON DELETE CASCADE
);