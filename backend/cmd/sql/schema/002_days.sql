-- +goose up

CREATE TABLE days (
    day_id UUID PRIMARY KEY,
    reference_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (reference_date, user_id)
);

-- +goose down

DROP TABLE days;