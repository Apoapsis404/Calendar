-- name: CreateEvent :one
INSERT INTO events (event_id, created_at, updated_at, event_name, start_time, end_time, reference_date)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: DeleteEvent :exec
DELETE FROM events
WHERE event_id=$1;