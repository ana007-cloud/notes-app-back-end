#!/bin/bash

# Hapi server PORT
PORT=${PORT:-5005} # change according to .env or default 5005

echo "=== 1) POST /users with invalid payload → should return 400 + fail ==="
curl -i -X POST "http://localhost:$PORT/users" \
  -H "Content-Type: application/json" \
  -d '{}'
echo -e "\n"

echo "=== 2) POST /users with valid payload → should return 201 + success + data.userId ==="
USER_ID=$(curl -s -X POST "http://localhost:$PORT/users" \
  -H "Content-Type: application/json" \
  -d '{"username":"u1","password":"p","fullname":"U One"}' | \
  jq -r '.data.userId')
echo "userId = $USER_ID"
echo -e "\n"

echo "=== 3) POST /notes with invalid payload → should return 400 + fail ==="
curl -i -X POST "http://localhost:$PORT/notes" \
  -H "Content-Type: application/json" \
  -d '{}'
echo -e "\n"

echo "=== 4) POST /notes with valid payload → should return 201 + success + data.noteId ==="
NOTE_ID=$(curl -s -X POST "http://localhost:$PORT/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"t","body":"b","tags":["x"]}' | \
  jq -r '.data.noteId')
echo "noteId = $NOTE_ID"
echo -e "\n"

echo "=== 5) GET /notes → should return 200 + success + data.notes ==="
curl -i -X GET "http://localhost:$PORT/notes"
echo -e "\n"

echo "=== 6) GET /notes/{nonexistentId} → should return 404 + fail ==="
curl -i -X GET "http://localhost:$PORT/notes/nonexistent-id"
echo -e "\n"

echo "=== 7) DELETE /notes/{existingId} → should return 200 + success ==="
curl -i -X DELETE "http://localhost:$PORT/notes/$NOTE_ID"
echo -e "\n"

echo "=== Smoke test completed ==="