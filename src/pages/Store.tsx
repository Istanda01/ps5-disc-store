import { useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { gamesOptions } from '../api/games';
import { useShopStore } from '../stores/shop';
import { filterGames } from '../lib/catalog';
import type { SortOrder } from '../types/game';
import { GameCard } from '../components/GameCard';
import { EmptyState, ErrorState, LoadingCards } from '../components/Feedback';

const sorts: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'เกมแนะนำ' },
  { value: 'price-asc', label: 'ราคา: ต่ำไปสูง' },
  { value: 'price-desc', label: 'ราคา: สูงไปต่ำ' },
  { value: 'name', label: 'ชื่อเกม: A–Z' }
];

export function StorePage() {
  const query = useQuery(gamesOptions);
  const search = useShopStore(s => s.search);
  const genre = useShopStore(s => s.genre);
  const sort = useShopStore(s => s.sort);
  const setSearch = useShopStore(s => s.setSearch);
  const setGenre = useShopStore(s => s.setGenre);
  const setSort = useShopStore(s => s.setSort);
  const reset = useShopStore(s => s.resetFilters);
  const deferredSearch = useDeferredValue(search);
  const games = query.data ?? [];
  const shown = filterGames(games, deferredSearch, genre, sort);
  const genres = [...new Set(games.map(g => g.genre))].sort();
  const filtered = search.trim() !== '' || genre !== 'all';

  return (
    <div className="container store-page">
      {/* แบนเนอร์ภาพแนวนอนเต็มเฟรม */}
      <section className="store-hero-full">
        <img 
          src="/images/your-banner.jpg" 
          alt="Beyond Digital - The Physical Gaming Legacy" 
          className="store-hero-img"
        />
      </section>

      <section id="catalog" className="catalog-section" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE COLLECTION</span>
            <h2 id="catalog-heading">ค้นหาเกมถัดไปของคุณ</h2>
          </div>
          <span className="result-count">
            {query.data ? `${shown.length} จาก ${games.length} เกม` : 'กำลังโหลดรายการ'}
          </span>
        </div>

        <div className="catalog-controls">
          <label className="search-field input">
            <Search size={20} />
            <input 
              type="search" 
              placeholder="ค้นหาชื่อเกมหรือประเภทเกม…" 
              aria-label="ค้นหาเกม" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            {search && (
              <button aria-label="ล้างคำค้นหา" onClick={() => setSearch('')}>
                <X size={17} />
              </button>
            )}
          </label>

          <label className="filter-field">
            <SlidersHorizontal size={17} />
            <select 
              aria-label="ประเภทเกม" 
              value={genre} 
              onChange={e => setGenre(e.target.value)}
            >
              <option value="all">ทุกประเภท</option>
              {genres.map(g => <option key={g}>{g}</option>)}
            </select>
          </label>

          <label className="filter-field sort-field">
            <span>เรียง:</span>
            <select 
              aria-label="เรียงลำดับเกม" 
              value={sort} 
              onChange={e => { 
                const option = sorts.find(s => s.value === e.target.value); 
                if (option) setSort(option.value); 
              }}
            >
              {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>

        {filtered && (
          <div className="active-filters">
            <span>
              {search && `ค้นหา “${search}”`}
              {search && genre !== 'all' && ' · '}
              {genre !== 'all' && genre}
            </span>
            <button className="btn btn-ghost btn-xs" onClick={reset}>
              ล้างตัวกรอง <X size={13} />
            </button>
          </div>
        )}

        {query.isPending ? (
          <LoadingCards />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => { void query.refetch(); }} />
        ) : shown.length === 0 ? (
          <EmptyState 
            title="ไม่พบเกมที่ตรงกับการค้นหา" 
            action={<button className="btn btn-primary" onClick={reset}>ล้างคำค้นหาและตัวกรอง</button>}
          >
            ลองใช้ชื่อเกมอื่น หรือเลือกประเภทเกมใหม่
          </EmptyState>
        ) : (
          <div className="games-grid" aria-label="รายการเกม">
            {shown.map((game, index) => (
              <GameCard game={game} key={game.id} eager={index < 4} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}