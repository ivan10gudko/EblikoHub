CREATE TABLE user_badges (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_badge_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_badge UNIQUE (user_id),
    CONSTRAINT chk_user_badge_type CHECK (type IN ('DEVELOPER', 'RESPECTED'))
);