# Grocery List API Documentation

## Base URL
```
http://127.0.0.1:8000/api
```

## Endpoints

### Lists

#### Get All Lists (with filtering)
```
GET /lists/
```

Query parameters:
- `username` (optional): Filter by username
- `isPublic` (optional): Filter by public/private status (true/false)

Example:
```bash
# Get all lists for user 'demo'
curl "http://127.0.0.1:8000/api/lists/?username=demo"

# Get all public lists for user 'demo'
curl "http://127.0.0.1:8000/api/lists/?username=demo&isPublic=true"
```

#### Get Public Lists
```
GET /lists/public/
```

Query parameters:
- `excludeUsername` (optional): Exclude lists from a specific username

Example:
```bash
# Get all public lists
curl "http://127.0.0.1:8000/api/lists/public/"

# Get all public lists excluding user 'demo'
curl "http://127.0.0.1:8000/api/lists/public/?excludeUsername=demo"
```

#### Create New List
```
POST /lists/
```

Request body:
```json
{
  "username": "string",
  "name": "string",
  "is_public": boolean
}
```

Example:
```bash
curl -X POST "http://127.0.0.1:8000/api/lists/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "name": "My New List",
    "is_public": true
  }'
```

#### Get Specific List
```
GET /lists/{list_id}/
```

#### Update List Name
```
PUT /lists/{list_id}/
```

Request body:
```json
{
  "name": "New List Name"
}
```

#### Delete List
```
DELETE /lists/{list_id}/
```

### Items

#### Add Item to List
```
POST /lists/{list_id}/items/
```

Request body:
```json
{
  "text": "Item text"
}
```

Example:
```bash
curl -X POST "http://127.0.0.1:8000/api/lists/70c93f67-26d7-46ea-831e-95a1ac815cd6/items/" \
  -H "Content-Type: application/json" \
  -d '{"text": "New grocery item"}'
```

#### Toggle Item Completion
```
PUT /lists/{list_id}/items/{item_id}/
```

Example:
```bash
curl -X PUT "http://127.0.0.1:8000/api/lists/70c93f67-26d7-46ea-831e-95a1ac815cd6/items/636735ac-7b7b-4160-8ec2-ce2362ff4140/"
```

#### Delete Item
```
DELETE /lists/{list_id}/items/{item_id}/
```

#### Clear Completed Items
```
DELETE /lists/{list_id}/clear-completed/
```

## Response Format

### List Object
```json
{
  "id": "uuid",
  "username": "string",
  "name": "string",
  "is_public": boolean,
  "created_at": "ISO datetime",
  "items": [...]
}
```

### Item Object
```json
{
  "id": "uuid",
  "text": "string",
  "completed": boolean,
  "created_at": "ISO datetime"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content (for deletions)
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Error responses include a JSON object with details:
```json
{
  "error": "Error message"
}
```

## Testing the API

You can test the API using the Django Admin interface at:
```
http://127.0.0.1:8000/admin/
```

Or use curl/PowerShell commands as shown in the examples above.

## Frontend Integration

The frontend React app automatically connects to this API. Make sure both servers are running:

1. Django backend: `uv run python manage.py runserver` (port 8000)
2. React frontend: `npm start` (port 3002)

The frontend transforms the Django API responses to match the TypeScript interfaces in `src/types/index.ts`.
