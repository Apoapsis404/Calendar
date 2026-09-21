-- name: CreateDay :one
INSERT INTO days (reference_date, created_at, updated_at, user_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetDays :many
SELECT * FROM days
WHERE reference_date=$1;

-- name: DeleteDay :exec
DELETE FROM days
WHERE reference_date=$1;