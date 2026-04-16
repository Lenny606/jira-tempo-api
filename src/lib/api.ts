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

function ensureTempoApi() {
  if (!(window as any).tempoApi) {
    throw new Error('Tempo API is not available. Ensure you are running the app in Electron (npm run electron:dev).');
  }
  return (window as any).tempoApi;
}

/**
 * Tempo API Client
 */
export const tempoClient = {
  getWorklogs: async (params: { from: string; to: string }) => {
    try {
      return await ensureTempoApi().listWorklogs(params);
    } catch (err: any) {
      console.error('[Frontend API] getWorklogs failed:', err);
      // Ensure we re-throw the actual error message
      throw err;
    }
  },
  createWorklog: (payload: any) => 
    ensureTempoApi().createWorklog(payload),
  updateWorklog: (id: string, payload: any) => 
    ensureTempoApi().updateWorklog(id, payload),
  deleteWorklog: (id: string) => 
    ensureTempoApi().deleteWorklog(id),
};
