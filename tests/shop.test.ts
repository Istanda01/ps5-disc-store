import { beforeEach, describe, expect, it } from 'vitest';
import { useShopStore } from '../src/stores/shop';

beforeEach(() => {
  localStorage.clear();
  useShopStore.setState({ wishlistIds: [], compareIds: [], search: '', genre: 'all', sort: 'featured', notice: null });
});

describe('Client state and persistence', () => {
  it('allows at most two different comparison IDs, without replacing earlier selections', () => {
    const store = useShopStore.getState();
    expect(store.toggleCompare('1')).toBe('added');
    expect(store.toggleCompare('2')).toBe('added');
    expect(store.toggleCompare('3')).toBe('full');
    expect(useShopStore.getState().compareIds).toEqual(['1', '2']);
    expect(useShopStore.getState().notice?.message).toContain('สูงสุด 2 เกม');
    expect(store.toggleCompare('1')).toBe('removed');
    expect(store.toggleCompare('3')).toBe('added');
    expect(useShopStore.getState().compareIds).toEqual(['2', '3']);
  });

  it('rejects duplicate replacements and replaces a selected game explicitly', () => {
    useShopStore.setState({ compareIds: ['1', '2'] });
    useShopStore.getState().replaceCompare('1', '2');
    expect(useShopStore.getState().compareIds).toEqual(['1', '2']);
    useShopStore.getState().replaceCompare('1', '3');
    expect(useShopStore.getState().compareIds).toEqual(['3', '2']);
  });

  it('persists only IDs and restores a saved collection from browser storage', async () => {
    useShopStore.getState().toggleWishlist('7');
    useShopStore.getState().setSearch('not persisted');
    const raw = localStorage.getItem('discs-for-sale-v1');
    if (!raw) throw new Error('Missing persisted state');
    const parsed = JSON.parse(raw) as { state: Record<string, unknown> };
    expect(Object.keys(parsed.state).sort()).toEqual(['compareIds', 'wishlistIds']);
    expect(parsed.state.wishlistIds).toEqual(['7']);
    useShopStore.setState({ wishlistIds: [] });
    localStorage.setItem('discs-for-sale-v1', raw);
    await useShopStore.persist.rehydrate();
    expect(useShopStore.getState().wishlistIds).toEqual(['7']);
    useShopStore.getState().toggleWishlist('7');
    expect(useShopStore.getState().wishlistIds).toEqual([]);
  });

  it('sanitizes duplicate, invalid and excessive persisted comparison IDs', async () => {
    localStorage.setItem('discs-for-sale-v1', JSON.stringify({ state: { wishlistIds: ['1', '1', null, 2], compareIds: ['1', '1', '2', '3'] }, version: 0 }));
    await useShopStore.persist.rehydrate();
    expect(useShopStore.getState().wishlistIds).toEqual(['1']);
    expect(useShopStore.getState().compareIds).toEqual(['1', '2']);
  });
});
