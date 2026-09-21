-- name: CreateDay :one
INSERT INTO days (day_id, reference_date, created_at, updated_at, user_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetDays :many
SELECT * FROM days
WHERE user_id=$1;

-- name: DeleteDay :exec
DELETE FROM days
WHERE day_id=$1;