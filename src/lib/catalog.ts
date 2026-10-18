import type { Game, SortOrder } from '../types/game';

export function filterGames(games: Game[], search: string, genre: string, sort: SortOrder): Game[] {
  const term = search.trim().toLocaleLowerCase();
  const result = games.filter(game =>
    (genre === 'all' || game.genre === genre)
    && (!term || `${game.title} ${game.genre} ${game.description}`.toLocaleLowerCase().includes(term))
  );
  // sort บนอาร์เรย์ใหม่ ไม่เปลี่ยนข้อมูลต้นฉบับใน Query cache
  return result.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price || a.title.localeCompare(b.title);
    if (sort === 'price-desc') return b.price - a.price || a.title.localeCompare(b.title);
    if (sort === 'name') return a.title.localeCompare(b.title);
    return Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id, undefined, { numeric: true });
  });
}

export const formatPrice = (price: number) => new Intl.NumberFormat('th-TH', {
  style: 'currency', currency: 'THB', maximumFractionDigits: 0
}).format(price);

export const formatDate = (value: string) => new Intl.DateTimeFormat('th-TH', {
  day: 'numeric', month: 'short', year: 'numeric'
}).format(new Date(`${value}T00:00:00`));
