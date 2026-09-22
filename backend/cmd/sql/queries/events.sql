-- name: CreateEvent :one
INSERT INTO events (event_id, created_at, updated_at, event_name, description, recurring, start_time, end_time, day_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: DeleteEvent :exec
DELETE FROM events
WHERE event_id=$1;

-- name: GetEvents :many
SELECT * FROM events
WHERE day_id=$1;

-- name: UpdateEvent :exec
UPDATE events
SET updated_at=$2,
    event_name=$3,
    description=$4,
    recurring=$5,
    start_time=$6,
    end_time=$7
WHERE event_id=$1;