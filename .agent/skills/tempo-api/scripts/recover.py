import json
import os
import sys

LOG_FILE = "logs/error.log"

def tail_log(n=50):
    if not os.path.exists(LOG_FILE):
        return []
    
    with open(LOG_FILE, "r") as f:
        lines = f.readlines()
        return lines[-n:]

def analyze_error(error_json):
    msg = error_json.get("msg", "").lower()
    error_data = error_json.get("error", {})
    
    # Check for status codes in error data
    status_code = error_data.get("status") or error_data.get("statusCode")
    
    # Heuristics for common Tempo issues
    if "401" in str(status_code) or "unauthorized" in msg:
        return {
            "type": "AUTHENTICATION_ERROR",
            "diagnosis": "The Tempo API Token is invalid or missing.",
            "fix": "Check your .env file for TEMPO_API_TOKEN. Ensure it's a bearer token from Tempo Settings > API Integration."
        }
    
    if "403" in str(status_code) or "forbidden" in msg:
        return {
            "type": "PERMISSION_ERROR",
            "diagnosis": "The token is valid but doesn't have permission for this action or Account Key.",
            "fix": "Verify that your user has 'Manage Worklogs' permissions in Tempo and that the Account/Team exists."
        }
    
    if "404" in str(status_code) or "not found" in msg:
        return {
            "type": "RESOURCE_NOT_FOUND",
            "diagnosis": "The worklog ID, Issue Key, or Account Key was not found.",
            "fix": "Verify the IDs provided. Ensure the Jira issue exists and is visible to you."
        }

    if "429" in str(status_code) or "too many requests" in msg:
        return {
            "type": "RATE_LIMIT",
            "diagnosis": "Tempo API rate limit exceeded.",
            "fix": "Wait 60 seconds and retry. If this persists, reduce the frequency of automated calls."
        }

    return None

def main():
    lines = tail_log()
    diagnostics = []
    
    for line in reversed(lines):
        try:
            data = json.loads(line)
            # Only focus on server errors or explicit tempo errors
            if data.get("type") == "server_error" or "tempo" in str(data).lower():
                diag = analyze_error(data)
                if diag and diag["type"] not in [d["type"] for d in diagnostics]:
                    diagnostics.append(diag)
        except json.JSONDecodeError:
            continue

    if not diagnostics:
        print("No specific Tempo issues identified in recent logs.")
        return

    print("--- TEMPO API DIAGNOSTIC REPORT ---")
    for d in diagnostics:
        print(f"\n[!] ISSUE: {d['type']}")
        print(f"    DIAGNOSIS: {d['diagnosis']}")
        print(f"    PROPOSED FIX: {d['fix']}")
    print("\n--- END REPORT ---")

if __name__ == "__main__":
    main()
