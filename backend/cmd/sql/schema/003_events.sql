-- +goose up

CREATE TYPE recurring_type AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

CREATE TABLE events (
    event_id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    event_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recurring recurring_type, 
    custom_recurring INT,

    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- +goose down
DROP TABLE events;
DROP TYPE recurring_type;