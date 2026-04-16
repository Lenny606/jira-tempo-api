---
name: tempo-api
description: Manage Tempo Cloud worklogs and accounts. Use when you need to perform CRUD operations on timesheets (worklogs) or link accounts to projects. Supports authentication via Tempo API tokens. Avoids standard Jira API for time tracking.
---

# Tempo API Interface

This skill provides a focused interface for the Tempo Cloud REST API. It allows for managing time tracking data directly through Tempo's endpoints, ensuring compatibility with Tempo-specific features like billable hours and account linking.

## Authentication Guide

All requests require a Tempo API Token (NOT a Jira API Token).

1.  **Generate Token**: Go to **Tempo > Settings > API Integration**.
2.  **Usage**: Include the token in the `Authorization` header.
    ```http
    Authorization: Bearer <TEMPO_API_TOKEN>
    ```

## Core Workflows

### 1. Worklog Management (CRUD)

| Operation | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Create** | `POST` | `/worklogs` | Create a new worklog entry. |
| **Read** | `GET` | `/worklogs/{id}` | Retrieve details of a specific worklog. |
| **List** | `GET` | `/worklogs` | List worklogs for a period (`from` & `to` required). |
| **Update** | `PUT` | `/worklogs/{id}` | Update an existing worklog. |
| **Delete** | `DELETE` | `/worklogs/{id}` | Remove a worklog entry. |

**Important Note on Create/Update:**
- `timeSpentSeconds` and `billableSeconds` should be in seconds.
- `startDate` format is `YYYY-MM-DD`.
- `startTime` format is `HH:mm:ss`.

### 2. Account & Team Integration

- **List Accounts**: `GET /accounts` - Use this to find Tempo Account keys for linking.
- **Get Account**: `GET /accounts/{key}`
- **List Teams**: `GET /teams` - Retrieve team structures for reporting.

---

## Decision Tree: Tempo vs Jira API

If the task involves:
- **Logging time** or **Editing timesheets** → **USE TEMPO API** (this skill).
- **Fetching Billable hours** or **Tempo Accounts** → **USE TEMPO API** (this skill).
- **Standard Issue metadata** (Summary, Status) → **DO NOT USE TEMPO API** (use Jira API if authorized, but this skill strictly excludes it).

> [!WARNING]
> **Constraint Check**: Ensure you never mix Tempo endpoints with Jira endpoints (`/rest/api/3`) unless explicitly requested to cross-reference data. This skill is optimized for standalone Tempo usage.

## Troubleshooting & Self-Fixing

If a Tempo API operation fails, you should proactively check the logs and attempt to diagnose the issue using the built-in recovery utility.

### Automated Diagnostics
1.  **Run Recovery Script**: If you encounter an error (e.g., rejection from `tempo_crud.py` or a network timeout), run:
    ```bash
    python .agent/skills/tempo-api/scripts/recover.py
    ```
2.  **Analyze Report**: The script will parse `logs/error.log` and provide a diagnostic report for common errors (401, 403, 404, 429).
3.  **Self-Fix**:
    -   If the report identifies a **401 Authentication Error**, verify the `.env` file and check if `TEMPO_API_TOKEN` is set correctly.
    -   If a **404 Resource Not Found** is identified, verify the IDs you are using.

### Common Error Codes
- `401 Unauthorized`: Token is missing or invalid. Note: Tempo tokens are DIFFERENT from Jira tokens.
- `403 Forbidden`: Permission issue. Ensure your token was created with the correct scopes.
- `429 Too Many Requests`: Rate limit reached. Wait 60s.

---

## Reference Materials

- **Detailed Endpoints**: See [api_reference.md](references/api_reference.md)
- **Implementation Pattern**: See [tempo_crud.py](scripts/tempo_crud.py) for a code example.
- **Recovery Logic**: See [recover.py](scripts/recover.py) for diagnostic logic.
