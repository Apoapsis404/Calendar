-- name: CreateUser :one
INSERT INTO users (user_id, created_at, updated_at, username, password, email)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;