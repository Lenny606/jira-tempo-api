/**
 * Jira API Client Skeleton
 */
export const jiraClient = {
  getIssues: async () => {
    // TODO: Implement Jira issues retrieval
    return [];
  },
  addWorklog: async (issueKey: string, timeSpentSeconds: number, comment: string) => {
    // TODO: Implement worklog submission
  }
};

/**
 * Tempo API Client Skeleton
 */
export const tempoClient = {
  getWorklogs: async (fromDate: string, toDate: string) => {
    // TODO: Implement Tempo worklogs retrieval
    return [];
  }
};
