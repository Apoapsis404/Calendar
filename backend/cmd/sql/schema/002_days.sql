-- +goose up

CREATE TABLE days (
    reference_date date PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- +goose down

DROP TABLE days;