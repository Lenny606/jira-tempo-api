export interface TempoApi {
  listWorklogs: (params: { from: string; to: string }) => Promise<any>;
  createWorklog: (payload: any) => Promise<any>;
  updateWorklog: (id: string, payload: any) => Promise<any>;
  deleteWorklog: (id: string) => Promise<any>;
}

declare global {
  interface Window {
    tempoApi: TempoApi;
  }
}
