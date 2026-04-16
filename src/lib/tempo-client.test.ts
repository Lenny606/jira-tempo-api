import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TempoMainClient as TempoClient } from '../../electron/tempo-main.js';

// Mock the logger to avoid polluting test output
vi.mock('./logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('TempoClient', () => {
  let client: TempoClient;

  beforeEach(() => {
    process.env.TEMPO_API_TOKEN = 'test-token';
    client = new TempoClient();
    vi.clearAllMocks();
    // Reset global fetch mock
    global.fetch = vi.fn();
  });

  it('should throw error if token is missing on request', async () => {
    delete process.env.TEMPO_API_TOKEN;
    const clientNoToken = new TempoClient();
    await expect(clientNoToken.listWorklogs('2026-04-01', '2026-04-30')).rejects.toThrow('TEMPO_API_TOKEN is missing');
  });

  describe('listWorklogs', () => {
    it('should fetch worklogs and validate response', async () => {
      const mockResponse = {
        metadata: { count: 1, offset: 0, limit: 50 },
        results: [
          {
            self: 'https://api.tempo.io/4/worklogs/1',
            tempoWorklogId: 1,
            issue: { self: 'https://api.tempo.io/4/issues/101', id: 101 },
            timeSpentSeconds: 3600,
            billableSeconds: 3600,
            startDate: '2026-04-16',
            startTime: '09:00:00',
            description: 'Test worklog',
            createdAt: '2026-04-16T09:00:00Z',
            updatedAt: '2026-04-16T09:00:00Z',
            author: { self: 'https://api.tempo.io/4/authors/acc-1', accountId: 'acc-1' },
          },
        ],
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.listWorklogs('2026-04-01', '2026-04-30');

      expect(result.results).toHaveLength(1);
      expect(result.results[0].tempoWorklogId).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/worklogs?from=2026-04-01&to=2026-04-30'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should throw error on invalid response schema', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      await expect(client.listWorklogs('2026-04-01', '2026-04-30')).rejects.toThrow('Invalid response from Tempo API');
    });

    it('should throw error on API failure', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid token',
      });

      await expect(client.listWorklogs('2026-04-01', '2026-04-30')).rejects.toThrow('Tempo API error: 401 Unauthorized');
    });
  });
});
