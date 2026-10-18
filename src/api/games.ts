import { queryOptions } from '@tanstack/react-query';
import type { Game } from '../types/game' ;

const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export const STALE_TIME = 5 * 60 * 1000;

function isGame(value: unknown): value is Game {
  if (typeof value !== 'object' || value === null) return false;
  const g = value as Record<string, unknown>;
  return ['id', 'title', 'cover', 'genre', 'players', 'platform', 'format', 'releaseDate', 'publisher', 'description']
    .every(key => typeof g[key] === 'string')
    && (g.banner === undefined || typeof g.banner === 'string')
    && (g.screenshots === undefined || (Array.isArray(g.screenshots) && g.screenshots.every(s => typeof s === 'string')))
    && typeof g.price === 'number' && Number.isFinite(g.price) && g.price >= 0
    && typeof g.featured === 'boolean';
}

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(path: string, signal?: AbortSignal): Promise<unknown> {
  // จำกัดเวลา ไม่ปล่อยให้หน้าจอค้างเมื่อ API ไม่ตอบกลับ
  const timeoutSignal = AbortSignal.timeout(12_000);
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  timeoutSignal.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) controller.abort();
  try {
    const response = await fetch(`${baseUrl}${path}`, { signal: controller.signal });
    if (!response.ok) {
      throw new ApiError(response.status === 404 ? 'ไม่พบเกมที่คุณเลือก' : 'API ไม่สามารถส่งข้อมูลได้', response.status);
    }
    return await response.json() as unknown;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) throw error;
    throw new ApiError('เชื่อมต่อข้อมูลเกมไม่ได้ กรุณาตรวจว่าเปิด JSON Server แล้ว');
  } finally {
    signal?.removeEventListener('abort', abort);
    timeoutSignal.removeEventListener('abort', abort);
  }
}

export async function getGames(signal?: AbortSignal): Promise<Game[]> {
  const data = await request('/games', signal);
  if (!Array.isArray(data) || !data.every(isGame)) {
    throw new ApiError('รูปแบบข้อมูลเกมไม่ถูกต้อง กรุณาตรวจ db.json');
  }
  // ตัดเหลือ 20 รายการแรกก่อนส่งกลับ
  return data.slice(0, 20);
}

export async function getGame(id: string, signal?: AbortSignal): Promise<Game> {
  const data = await request(`/games/${encodeURIComponent(id)}`, signal);
  if (!isGame(data)) throw new ApiError('รูปแบบข้อมูลเกมไม่ถูกต้อง กรุณาตรวจ db.json');
  return data;
}

export const gamesOptions = queryOptions({
  queryKey: ['games'],
  queryFn: ({ signal }) => getGames(signal),
  staleTime: STALE_TIME
});

export function gameOptions(id: string) {
  return queryOptions({
    queryKey: ['game', id],
    queryFn: ({ signal }) => getGame(id, signal),
    staleTime: STALE_TIME
  });
}

