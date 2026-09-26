-- name: CreateEvent :one
INSERT INTO events (event_id, created_at, updated_at, event_name, description, recurring, custom_recurring, start_time, end_time, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: DeleteEvent :exec
DELETE FROM events
WHERE event_id=$1;

-- name: GetEvents :many
SELECT * FROM events
WHERE user_id=$1;

-- name: UpdateEvent :exec
UPDATE events
SET updated_at=$2,
    event_name=$3,
    description=$4,
    recurring=$5,
    custom_recurring=$6,
    start_time=$7,
    end_time=$8
WHERE event_id=$1;