import { ipcMain } from 'electron';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

const TEMPO_BASE_URL = process.env.TEMPO_BASE_URL || 'https://api.tempo.io/4';

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
    const method = options.method || 'GET';
    
    console.log(`[Tempo API] Sending ${method} request to ${url}`);

    const headers = {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    console.log(`[Tempo API] Response: ${response.status} ${response.statusText}`);

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

/**
 * Helper to write logs to disk from Main process
 */
async function writeMainLog(level, msg, extra = {}) {
  const LOG_DIR = path.join(process.cwd(), 'logs');
  const ERROR_LOG = path.join(LOG_DIR, 'error.log');
  
  const entry = JSON.stringify({
    time: new Date().toISOString(),
    level,
    msg,
    process: 'main',
    ...extra
  }) + '\n';
  
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(ERROR_LOG, entry);
  } catch (err) {
    console.error('Failed to write log file:', err);
  }
}

export function setupTempoIpc() {
  const client = new TempoMainClient();

  ipcMain.handle('tempo:listWorklogs', async (event, { from, to }) => {
    try {
      return await client.listWorklogs(from, to);
    } catch (err) {
      await writeMainLog(50, `Tempo List Error: ${err.message}`, { path: '/worklogs', from, to });
      throw err;
    }
  });

  ipcMain.handle('tempo:createWorklog', async (event, payload) => {
    try {
      return await client.createWorklog(payload);
    } catch (err) {
      await writeMainLog(50, `Tempo Create Error: ${err.message}`, { payload });
      throw err;
    }
  });

  ipcMain.handle('tempo:updateWorklog', async (event, { id, payload }) => {
    try {
      return await client.updateWorklog(id, payload);
    } catch (err) {
      await writeMainLog(50, `Tempo Update Error: ${err.message}`, { id, payload });
      throw err;
    }
  });

  ipcMain.handle('tempo:deleteWorklog', async (event, id) => {
    try {
      return await client.deleteWorklog(id);
    } catch (err) {
      await writeMainLog(50, `Tempo Delete Error: ${err.message}`, { id });
      throw err;
    }
  });

  // Log Handlers
  const LOG_DIR = path.join(process.cwd(), 'logs');
  const ERROR_LOG = path.join(LOG_DIR, 'error.log');

  ipcMain.handle('log:list', async () => {
    try {
      const data = await fs.readFile(ERROR_LOG, 'utf8');
      return data.split('\n').filter(Boolean).map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { msg: line, time: new Date().toISOString(), level: 30 };
        }
      }).reverse(); // Latest logs first
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  });

  ipcMain.handle('log:write', async (event, { level, msg, ...rest }) => {
    const entry = JSON.stringify({
      time: new Date().toISOString(),
      level,
      msg,
      process: 'renderer',
      ...rest
    }) + '\n';
    
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(ERROR_LOG, entry);
    
    // Also log to console for debugging
    console.log(`[RENDERER] ${msg}`, rest);
  });
}
