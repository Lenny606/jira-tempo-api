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

## Reference Materials

- **Detailed Endpoints**: See [api_reference.md](references/api_reference.md)
- **Implementation Pattern**: See [tempo_crud.py](scripts/tempo_crud.py) for a code example.
