import { ArrowUpRight, Check, GitCompareArrows, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Game } from '../types/game';
import { formatPrice } from '../lib/catalog';
import { useShopStore } from '../stores/shop';
import { Cover } from './Cover';

export function GameCard({ game, eager = false }: { game: Game; eager?: boolean }) {
  const saved = useShopStore(s => s.wishlistIds.includes(game.id));
  const compared = useShopStore(s => s.compareIds.includes(game.id));
  const toggleWishlist = useShopStore(s => s.toggleWishlist);
  const toggleCompare = useShopStore(s => s.toggleCompare);
  return <article className="game-card card bg-base-100" data-testid={`game-${game.id}`}>
    <Link to={`/games/${game.id}`} aria-label={`ดูรายละเอียด ${game.title}`} className="cover-link">
      <Cover src={game.cover} title={game.title} eager={eager} />
      {game.featured && <span className="featured-tag">ร้านแนะนำ</span>}
    </Link>
    <div className="game-card-body">
      <div className="game-heading"><Link to={`/games/${game.id}`}><h2>{game.title}</h2></Link>
        <button className={`btn btn-circle btn-ghost save-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleWishlist(game.id)}
          aria-label={`${saved ? 'เลิกบันทึก' : 'บันทึก'} ${game.title}`} aria-pressed={saved} title={saved ? 'นำออกจากรายการที่สนใจ' : 'บันทึกเกมที่สนใจ'}>
          <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="game-genre">{game.genre}</p>
      <p className="game-price">{formatPrice(game.price)} <span>ราคาจำลอง</span></p>
      <Link className="btn btn-outline details-button" to={`/games/${game.id}`}>ดูรายละเอียด <ArrowUpRight size={16} /></Link>
      <button className={`compare-button ${compared ? 'is-selected' : ''}`} onClick={() => toggleCompare(game.id)} aria-pressed={compared}>
        {compared ? <Check size={16} /> : <GitCompareArrows size={16} />} {compared ? 'เลือกเปรียบเทียบแล้ว' : 'เพิ่มเพื่อเปรียบเทียบ'}
      </button>
    </div>
  </article>;
}
