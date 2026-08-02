CREATE TABLE user_favorite_titles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_favorite_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_favorite_title FOREIGN KEY (title_id) REFERENCES titles (title_id) ON DELETE CASCADE,
    
    CONSTRAINT uk_user_title_favorite UNIQUE (user_id, title_id)
);