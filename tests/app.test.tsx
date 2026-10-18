import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import db from '../db.json';
import { routes } from '../src/router';
import { useShopStore } from '../src/stores/shop';
import { gamesOptions, getGames } from '../src/api/games';
import { filterGames } from '../src/lib/catalog';

const clients: QueryClient[] = [];

function renderPage(path = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider>);
  return { router, client };
}

beforeEach(() => {
  localStorage.clear();
  useShopStore.setState({ wishlistIds: [], compareIds: [], search: '', genre: 'all', sort: 'featured', notice: null });
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url === '/api/games') return new Response(JSON.stringify(db.games), { status: 200 });
    const game = db.games.find(g => url === `/api/games/${g.id}`);
    return game ? new Response(JSON.stringify(game), { status: 200 }) : new Response('{}', { status: 404 });
  }));
});

afterEach(() => {
  cleanup();
  clients.splice(0).forEach(c => c.clear());
  vi.unstubAllGlobals();
  vi.stubGlobal('scrollTo', vi.fn());
});

describe('Connected application', () => {
  it('loads all 20 items and supports search, empty state, reset and sorting', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByTestId('game-20');
    expect(screen.getAllByRole('article')).toHaveLength(20);
    await user.type(screen.getByRole('searchbox', { name: 'ค้นหาเกม' }), 'not-a-real-game');
    expect(await screen.findByText('ไม่พบเกมที่ตรงกับการค้นหา')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'ล้างคำค้นหาและตัวกรอง' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'เรียงลำดับเกม' }), 'price-asc');
    const firstId = filterGames(db.games, '', 'all', 'price-asc')[0].id;
    expect(screen.getAllByRole('article')[0].getAttribute('data-testid')).toBe(`game-${firstId}`);
    await user.selectOptions(screen.getByRole('combobox', { name: 'ประเภทเกม' }), 'Racing');
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('shows loading, network error and a working retry button', async () => {
    const user = userEvent.setup();
    const failedFetch = vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValue(new Response(JSON.stringify(db.games)));
    vi.stubGlobal('fetch', failedFetch);
    renderPage();
    expect(screen.getByRole('status', { name: 'กำลังโหลดข้อมูลเกม' })).toBeTruthy();
    expect(await screen.findByRole('alert')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'ลองอีกครั้ง' }));
    expect(await screen.findByTestId('game-1')).toBeTruthy();
  });

  it('opens the correct dynamic detail route and allows saving from detail', async () => {
    const user = userEvent.setup();
    renderPage('/games/2');
    expect(await screen.findByRole('heading', { level: 1, name: db.games[1].title })).toBeTruthy();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith('/api/games/2', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    await user.click(screen.getByRole('button', { name: 'บันทึกเกมที่สนใจ' }));
    expect(useShopStore.getState().wishlistIds).toEqual(['2']);
  });

  it('handles a missing game without crashing', async () => {
    renderPage('/games/missing');
    expect(await screen.findByRole('heading', { name: 'ไม่พบเกมนี้' })).toBeTruthy();
  });

  it('adds a saved game, navigates to Wishlist, and removes it', async () => {
    const user = userEvent.setup();
    renderPage();
    const card = await screen.findByTestId('game-1');
    await user.click(within(card).getByRole('button', { name: `บันทึก ${db.games[0].title}` }));
    await user.click(screen.getByRole('link', { name: /ที่สนใจ 1/ }));
    expect(await screen.findByRole('heading', { level: 1, name: /เกมที่คุณสนใจ/ })).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: `เลิกบันทึก ${db.games[0].title}` }));
    expect(await screen.findByText('ยังไม่มีเกมในรายการที่สนใจ')).toBeTruthy();
  });

  it('does not navigate automatically when two games are selected and rejects a third', async () => {
    const user = userEvent.setup();
    const { router } = renderPage();
    for (const id of ['1', '2', '3']) {
      const card = await screen.findByTestId(`game-${id}`);
      await user.click(within(card).getByRole('button', { name: 'เพิ่มเพื่อเปรียบเทียบ' }));
    }
    expect(router.state.location.pathname).toBe('/');
    expect(useShopStore.getState().compareIds).toEqual(['1', '2']);
    await user.click(screen.getByRole('link', { name: 'เปรียบเทียบ 2 เกม' }));
    expect(await screen.findByRole('table')).toBeTruthy();
    await user.selectOptions(screen.getByRole('combobox', { name: 'เปลี่ยนเกมช่องที่ 1' }), '3');
    expect(useShopStore.getState().compareIds).toEqual(['3', '2']);
    await user.click(screen.getByRole('button', { name: 'ล้างการเลือก' }));
    expect(useShopStore.getState().compareIds).toEqual([]);
    expect(screen.getByRole('combobox', { name: 'เลือกเกมช่องที่ 1' })).toBeTruthy();
  });

  it('renders About without requiring the games API', async () => {
    renderPage('/about');
    expect(screen.getByRole('heading', { name: 'ทีมผู้พัฒนา' })).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reuses the shared server cache while the list remains fresh', async () => {
    const client = new QueryClient(); clients.push(client);
    await client.fetchQuery(gamesOptions);
    await client.fetchQuery(gamesOptions);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed API responses instead of displaying broken records', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{ id: 1, price: 'bad' }]))));
    await expect(getGames()).rejects.toThrow('รูปแบบข้อมูลเกมไม่ถูกต้อง');
  });

  it('preserves the original server array when sorting', () => {
    const original = db.games.map(g => g.id);
    filterGames(db.games, '', 'all', 'price-desc');
    expect(db.games.map(g => g.id)).toEqual(original);
  });
});
