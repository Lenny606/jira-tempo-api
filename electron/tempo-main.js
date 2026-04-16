import { ipcMain } from 'electron';
import { z } from 'zod';

const TEMPO_BASE_URL = 'https://api.tempo.io/4';

/**
 * Zod Schemas for Validation
 */
const WorklogSchema = z.object({
  tempoWorklogId: z.number(),
  issue: z.object({ id: z.number() }),
  timeSpentSeconds: z.number(),
  startDate: z.string(),
  startTime: z.string(),
  description: z.string(),
});

const WorklogListResponseSchema = z.object({
  results: z.array(WorklogSchema),
});

export class TempoMainClient {
  getToken() {
    const token = process.env.TEMPO_API_TOKEN;
    if (!token) {
      console.error('TEMPO_API_TOKEN is not defined in environment variables');
      throw new Error('TEMPO_API_TOKEN is missing');
    }
    return token;
  }

  async request(path, options = {}) {
    const url = `${TEMPO_BASE_URL}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Tempo API request failed:', {
        status: response.status,
        statusText: response.statusText,
        path,
        error: errorBody,
      });
      throw new Error(`Tempo API error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return {};
    return response.json();
  }

  async listWorklogs(from, to) {
    const data = await this.request(`/worklogs?from=${from}&to=${to}`);
    const result = WorklogListResponseSchema.safeParse(data);
    if (!result.success) {
      console.error('Tempo API response validation failed:', result.error.format());
      throw new Error('Invalid response from Tempo API');
    }
    return result.data;
  }

  async createWorklog(payload) {
    const data = await this.request('/worklogs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const result = WorklogSchema.safeParse(data);
    if (!result.success) {
      throw new Error('Invalid response from Tempo API');
    }
    return result.data;
  }

  async updateWorklog(id, payload) {
    const data = await this.request(`/worklogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const result = WorklogSchema.safeParse(data);
    if (!result.success) {
      throw new Error('Invalid response from Tempo API');
    }
    return result.data;
  }

  async deleteWorklog(id) {
    return this.request(`/worklogs/${id}`, {
      method: 'DELETE',
    });
  }
}

export function setupTempoIpc() {
  const client = new TempoMainClient();

  ipcMain.handle('tempo:listWorklogs', async (event, { from, to }) => {
    return await client.listWorklogs(from, to);
  });

  ipcMain.handle('tempo:createWorklog', async (event, payload) => {
    return await client.createWorklog(payload);
  });

  ipcMain.handle('tempo:updateWorklog', async (event, { id, payload }) => {
    return await client.updateWorklog(id, payload);
  });

  ipcMain.handle('tempo:deleteWorklog', async (event, id) => {
    return await client.deleteWorklog(id);
  });
}
