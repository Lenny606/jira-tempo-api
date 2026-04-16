# Tempo Cloud REST API Reference

Tempo uses its own API, separate from the Jira REST API. All requests to the Tempo API must be authenticated with a Tempo API Token.

## Authentication
Authentication is done via a Bearer token in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <TEMPO_API_TOKEN>
```

**Base URL:**
`https://api.tempo.io/core/3`

---

## Worklogs

### 1. Create a Worklog
**Endpoint:** `POST /worklogs`
**Payload:**
```json
{
  "issueKey": "JIRA-123",
  "timeSpentSeconds": 3600,
  "billableSeconds": 3600,
  "startDate": "2023-10-27",
  "startTime": "09:00:00",
  "description": "Implemented new feature",
  "authorAccountId": "5f...abc"
}
```

### 2. Get a Worklog
**Endpoint:** `GET /worklogs/{id}`

### 3. List Worklogs
**Endpoint:** `GET /worklogs`
**Query Parameters:**
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)
- `user`: accountId of the user
- `limit`: Default 50, Max 500
- `offset`: For pagination

### 4. Update a Worklog
**Endpoint:** `PUT /worklogs/{id}`
**Payload:** (Similar to Create)

### 5. Delete a Worklog
**Endpoint:** `DELETE /worklogs/{id}`

---

## Tempo Accounts

### List All Accounts
**Endpoint:** `GET /accounts`

### Get Account by Key
**Endpoint:** `GET /accounts/{key}`

---

## Tempo Attributes (Custom Fields)

### List Worklog Attributes
**Endpoint:** `GET /worklog-attributes`
These are custom fields defined in Tempo (e.g., Activity Type).

---

## Important Constraints
- **NO JIRA API**: Do not use `/rest/api/2` or `/rest/api/3` endpoints if the goal is strictly Tempo data. 
- **Account IDs**: Always use Jira Account IDs (`accountId`) for user identification, not usernames or emails.
