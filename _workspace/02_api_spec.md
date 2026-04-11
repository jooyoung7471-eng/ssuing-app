# EngWrite API Specification

## Base URL
```
http://localhost:3000/api
```

## Authentication
JWT Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success (single)
```json
{ "data": T }
```

### Success (list with pagination)
```json
{
  "data": T[],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message"
  }
}
```

## Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | Missing/invalid token |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate resource |
| LLM_ERROR | 502 | LLM API call failed |
| INTERNAL_ERROR | 500 | Server error |

---

## Endpoints

### 1. Auth

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "jwt-token",
    "createdAt": "2026-04-04T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "token": "jwt-token"
  }
}
```

---

### 2. Sentences

#### GET /api/sentences/daily?theme=daily|business
Get today's 3 sentences for the given theme. Requires auth.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| theme | string | yes | "daily" or "business" |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "koreanText": "나는 어제 친구와 카페에서 커피를 마셨다.",
      "theme": "daily",
      "difficulty": 1,
      "hintWords": [
        { "english": "yesterday", "korean": "어제" },
        { "english": "friend", "korean": "친구" },
        { "english": "cafe", "korean": "카페" },
        { "english": "coffee", "korean": "커피" }
      ],
      "order": 1,
      "isCompleted": false
    }
  ]
}
```

#### GET /api/sentences/:id
Get sentence detail. Requires auth.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "koreanText": "나는 어제 친구와 카페에서 커피를 마셨다.",
    "theme": "daily",
    "difficulty": 1,
    "hintWords": [
      { "english": "yesterday", "korean": "어제" },
      { "english": "friend", "korean": "친구" }
    ],
    "createdAt": "2026-04-04T00:00:00.000Z"
  }
}
```

---

### 3. Corrections

#### POST /api/corrections
Submit user writing for LLM correction. Requires auth.

**Request Body:**
```json
{
  "sentenceId": "uuid",
  "userWriting": "I drank coffee with friend at cafe yesterday."
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "sentenceId": "uuid",
    "userWriting": "I drank coffee with friend at cafe yesterday.",
    "correctedSentence": "I had coffee with my friend at a cafe yesterday.",
    "explanation": "...",
    "score": 7,
    "highlights": [
      {
        "original": "drank",
        "corrected": "had",
        "reason": "'have coffee'가 관용적 표현"
      }
    ],
    "createdAt": "2026-04-04T00:00:00.000Z"
  }
}
```

---

### 4. History

#### GET /api/history?page=1&limit=20&theme=daily
Get user's correction history. Requires auth.

**Query Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| page | number | no | 1 | Page number |
| limit | number | no | 20 | Items per page |
| theme | string | no | - | Filter by theme |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "sentenceId": "uuid",
      "koreanText": "나는 어제 친구와 카페에서 커피를 마셨다.",
      "userWriting": "I drank coffee with friend...",
      "correctedSentence": "I had coffee with my friend...",
      "score": 7,
      "createdAt": "2026-04-04T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### GET /api/history/:id
Get correction detail. Requires auth.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "sentenceId": "uuid",
    "koreanText": "나는 어제 친구와 카페에서 커피를 마셨다.",
    "userWriting": "I drank coffee with friend...",
    "correctedSentence": "I had coffee with my friend...",
    "explanation": "...",
    "score": 7,
    "highlights": [...],
    "createdAt": "2026-04-04T00:00:00.000Z"
  }
}
```

#### GET /api/history/stats
Get learning statistics. Requires auth.

**Response (200):**
```json
{
  "data": {
    "totalCorrections": 45,
    "averageScore": 7.2,
    "streakDays": 5,
    "dailyStats": [
      { "date": "2026-04-04", "count": 3, "averageScore": 7.5 },
      { "date": "2026-04-03", "count": 3, "averageScore": 6.8 }
    ],
    "weeklyStats": [
      { "week": "2026-W14", "count": 12, "averageScore": 7.1 }
    ]
  }
}
```
