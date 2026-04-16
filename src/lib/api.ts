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
 * Tempo API Client
 * Using Electron IPC for secure Main Process calls
 */
export const tempoClient = {
  getWorklogs: (params: { from: string; to: string }) => 
    (window as any).tempoApi.listWorklogs(params),
  createWorklog: (payload: any) => 
    (window as any).tempoApi.createWorklog(payload),
  updateWorklog: (id: string, payload: any) => 
    (window as any).tempoApi.updateWorklog(id, payload),
  deleteWorklog: (id: string) => 
    (window as any).tempoApi.deleteWorklog(id),
};
