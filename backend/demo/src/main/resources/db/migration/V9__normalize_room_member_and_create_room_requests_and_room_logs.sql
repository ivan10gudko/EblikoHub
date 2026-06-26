CREATE TABLE IF NOT EXISTS room_requests (
    id UUID PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_room_requests_room_user UNIQUE (room_id, user_id),
    CONSTRAINT fk_room_requests_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    CONSTRAINT fk_room_requests_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_room_requests_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT check_request_status_enum CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CONSTRAINT check_request_type_enum CHECK (type IN ('JOIN_REQUEST', 'INVITE', 'OWNER'))
);

CREATE INDEX IF NOT EXISTS idx_room_requests_room_id ON room_requests(room_id);
CREATE INDEX IF NOT EXISTS idx_room_requests_user_id ON room_requests(user_id);

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='sender_id') THEN
        ALTER TABLE room_members DROP COLUMN sender_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='status') THEN
        ALTER TABLE room_members DROP COLUMN status;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='type') THEN
        ALTER TABLE room_members DROP COLUMN type;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='role') THEN
        ALTER TABLE room_members ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'MEMBER';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='is_pinned') THEN
        ALTER TABLE room_members ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='room_members' AND column_name='created_at') THEN
        ALTER TABLE room_members ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_room_members_user') THEN
        ALTER TABLE room_members ADD CONSTRAINT fk_room_members_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_room_members_room') THEN
        ALTER TABLE room_members ADD CONSTRAINT fk_room_members_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE;
    END IF;
END $$;


DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_room_members_room_user') THEN
        ALTER TABLE room_members DROP CONSTRAINT uk_room_members_room_user;
    END IF;
END $$;

ALTER TABLE room_members ADD CONSTRAINT uk_room_members_room_user UNIQUE (room_id, user_id);


CREATE TABLE IF NOT EXISTS room_activity_log (
    id UUID PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT check_room_action_enum CHECK (action IN ('JOINED', 'LEFT', 'INVITED', 'BANNED'))
);

CREATE INDEX IF NOT EXISTS idx_room_activity_room_id ON room_activity_log(room_id);