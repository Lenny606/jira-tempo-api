import requests
import json
import sys
import argparse

BASE_URL = "https://api.tempo.io/core/3"

class TempoClient:
    def __init__(self, token):
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def create_worklog(self, issue_key, seconds, date, start_time, description, author_id):
        url = f"{BASE_URL}/worklogs"
        payload = {
            "issueKey": issue_key,
            "timeSpentSeconds": seconds,
            "startDate": date,
            "startTime": start_time,
            "description": description,
            "authorAccountId": author_id
        }
        response = requests.post(url, headers=self.headers, data=json.dumps(payload))
        return response.json()

    def get_worklog(self, worklog_id):
        url = f"{BASE_URL}/worklogs/{worklog_id}"
        response = requests.get(url, headers=self.headers)
        return response.json()

    def list_worklogs(self, from_date, to_date, user_id=None):
        url = f"{BASE_URL}/worklogs?from={from_date}&to={to_date}"
        if user_id:
            url += f"&user={user_id}"
        response = requests.get(url, headers=self.headers)
        return response.json()

    def update_worklog(self, worklog_id, payload):
        url = f"{BASE_URL}/worklogs/{worklog_id}"
        response = requests.put(url, headers=self.headers, data=json.dumps(payload))
        return response.json()

    def delete_worklog(self, worklog_id):
        url = f"{BASE_URL}/worklogs/{worklog_id}"
        response = requests.delete(url, headers=self.headers)
        return response.status_code == 204

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tempo API CRUD CLI")
    parser.add_name("--token", required=True, help="Tempo API Token")
    parser.add_argument("action", choices=["list", "get", "create", "delete"])
    # ... more arguments for specific actions ...
    
    # This is a helper script for the Skill. Full CLI implementation omitted for brevity
    # as its primary purpose is to show the implementation pattern for Claude.
    pass
