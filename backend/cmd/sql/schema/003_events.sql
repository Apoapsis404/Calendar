-- +goose up

CREATE TABLE events (
    event_id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    event_name VARCHAR(255) NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,

    reference_date date NOT NULL REFERENCES days(reference_date) ON DELETE CASCADE
);

-- +goose down
DROP TABLE events;