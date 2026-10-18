import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SortOrder } from '../types/game';

type CompareResult = 'added' | 'removed' | 'full';
interface Notice { message: string; token: number }

export interface ShopState {
  wishlistIds: string[];
  compareIds: string[];
  search: string;
  genre: string;
  sort: SortOrder;
  notice: Notice | null;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => CompareResult;
  replaceCompare: (oldId: string, newId: string) => void;
  clearCompare: () => void;
  setSearch: (search: string) => void;
  setGenre: (genre: string) => void;
  setSort: (sort: SortOrder) => void;
  resetFilters: () => void;
  notify: (message: string) => void;
  dismissNotice: () => void;
}

// กรองข้อมูลที่อ่านจาก LocalStorage ก่อนใช้งาน และลบ ID ซ้ำ
function safeIds(value: unknown, limit = 1000): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))].slice(0, limit)
    : [];
}

export const useShopStore = create<ShopState>()(persist((set, get) => ({
  wishlistIds: [], compareIds: [], search: '', genre: 'all', sort: 'featured', notice: null,
  toggleWishlist: id => {
    const exists = get().wishlistIds.includes(id);
    set({ wishlistIds: exists ? get().wishlistIds.filter(item => item !== id) : [...get().wishlistIds, id] });
    get().notify(exists ? 'นำเกมออกจากรายการที่สนใจแล้ว' : 'บันทึกเกมที่สนใจแล้ว');
  },
  toggleCompare: id => {
    const ids = get().compareIds;
    if (ids.includes(id)) {
      set({ compareIds: ids.filter(item => item !== id) });
      return 'removed';
    }
    if (ids.length >= 2) {
      get().notify('เลือกได้สูงสุด 2 เกม กรุณานำเกมเดิมออกก่อน');
      return 'full';
    }
    set({ compareIds: [...ids, id] });
    get().notify(`เลือกเปรียบเทียบแล้ว ${get().compareIds.length}/2 เกม`);
    return 'added';
  },
  replaceCompare: (oldId, newId) => {
    if (newId === oldId) return;
    if (get().compareIds.includes(newId)) { get().notify('เกมนี้อยู่ในรายการเปรียบเทียบแล้ว'); return; }
    set({ compareIds: get().compareIds.map(id => id === oldId ? newId : id) });
    get().notify('เปลี่ยนเกมที่เปรียบเทียบแล้ว');
  },
  clearCompare: () => set({ compareIds: [] }),
  setSearch: search => set({ search }),
  setGenre: genre => set({ genre }),
  setSort: sort => set({ sort }),
  resetFilters: () => set({ search: '', genre: 'all', sort: 'featured' }),
  notify: message => set({ notice: { message, token: Date.now() + Math.random() } }),
  dismissNotice: () => set({ notice: null })
}), {
  name: 'discs-for-sale-v1',
  storage: createJSONStorage(() => localStorage),
  // บันทึกเฉพาะ ID ของคอลเลกชัน ไม่บันทึกข้อมูลเกมจาก API
  partialize: state => ({ wishlistIds: state.wishlistIds, compareIds: state.compareIds }),
  merge: (persisted: unknown, current) => {
    const value = typeof persisted === 'object' && persisted !== null ? persisted as Record<string, unknown> : {};
    return { ...current, wishlistIds: safeIds(value.wishlistIds), compareIds: safeIds(value.compareIds, 2) };
  }
}));
