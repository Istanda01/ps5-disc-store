import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, GitCompareArrows, Heart, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gamesOptions } from '../api/games';
import { useShopStore } from '../stores/shop';
import { formatDate, formatPrice } from '../lib/catalog';
import { Cover } from '../components/Cover';
import { ErrorState, LoadingCards } from '../components/Feedback';
import type { Game } from '../types/game';

export function ComparePage() {
  const ids = useShopStore(s => s.compareIds);
  const clear = useShopStore(s => s.clearCompare);
  const toggle = useShopStore(s => s.toggleCompare);
  const replace = useShopStore(s => s.replaceCompare);
  const toggleWishlist = useShopStore(s => s.toggleWishlist);
  const wishlistIds = useShopStore(s => s.wishlistIds);
  const query = useQuery(gamesOptions);
  const allGames = query.data ?? [];
  const games = ids.map(id => allGames.find(game => game.id === id));
  const columns: (Game | undefined)[] = [games[0], games[1]];
  function field(label: string, content: (g: Game) => ReactNode, special = false) {
    return <tr key={label}><th scope="row">{label}</th>{columns.map((g, i) => <td key={i} className={special ? 'compare-price' : ''}>{g ? content(g) : '—'}</td>)}</tr>;
  }
  return <div className="container inner-page">
    <div className="page-heading"><div><span className="section-kicker">SIDE BY SIDE</span><h1>เทียบก่อนเลือก <GitCompareArrows size={30} /></h1><p>ดูความแตกต่างของ 2 เกม โดยไม่ต้องเปิดสลับไปมา</p></div><button className="btn btn-outline" onClick={clear} disabled={ids.length === 0}><X size={16} /> ล้างการเลือก</button></div>
    {query.isPending ? <LoadingCards count={2} /> : query.isError ? <ErrorState error={query.error} retry={() => { void query.refetch(); }} />
      : <><div className="compare-table-wrap"><table className="compare-table"><caption className="sr-only">ตารางเปรียบเทียบเกมที่เลือก {ids.length} เกม</caption><thead><tr><th scope="col"><span className="section-kicker">YOUR SELECTION</span><p>เลือกแล้ว {ids.length}/2 เกม</p></th>
        {columns.map((game, index) => <th scope="col" key={index} className="compare-game-cell">
          {game ? <><div className="compare-cover"><Cover key={game.id} src={game.cover} title={game.title} eager /><button className="remove-compare btn btn-circle btn-sm" onClick={() => toggle(game.id)} aria-label={`นำ ${game.title} ออกจากการเปรียบเทียบ`}><X size={16} /></button></div><h2>{game.title}</h2></>
            : <div className="compare-empty-slot"><Plus size={32} /><h2>{ids[index] ? 'ไม่พบเกมที่เลือก' : `เลือกเกมที่ ${index + 1}`}</h2>{ids[index] && <button className="btn btn-ghost btn-xs" onClick={() => toggle(ids[index])}>นำรายการที่ไม่พบออก</button>}</div>}
          <select className="select select-bordered change-game" aria-label={`${game ? 'เปลี่ยน' : 'เลือก'}เกมช่องที่ ${index + 1}`} value={game?.id ?? ''} onChange={e => {
            if (!e.target.value) return;
            const oldId = ids[index];
            if (oldId) replace(oldId, e.target.value); else toggle(e.target.value);
          }}><option value="" disabled>เลือกเกม…</option>{allGames.map(g => <option key={g.id} value={g.id} disabled={ids.includes(g.id) && g.id !== game?.id}>{g.title}</option>)}</select>
        </th>)}</tr></thead><tbody>
          {field('ราคาแผ่น (จำลอง)', g => formatPrice(g.price), true)}
          {field('ประเภทเกม', g => g.genre)}{field('จำนวนผู้เล่น', g => g.players)}
          {field('แพลตฟอร์ม', g => g.platform)}{field('รูปแบบสินค้า', g => g.format)}
          {field('วันวางจำหน่าย PS5', g => formatDate(g.releaseDate))}{field('ผู้จัดจำหน่าย', g => g.publisher)}
          <tr className="compare-actions-row"><th scope="row"><span className="sr-only">การทำงาน</span></th>{columns.map((g, i) => <td key={i}>{g && <div className="compare-actions"><button className={`btn ${wishlistIds.includes(g.id) ? 'btn-soft btn-primary' : 'btn-primary'}`} onClick={() => toggleWishlist(g.id)} aria-pressed={wishlistIds.includes(g.id)}><Heart size={16} fill={wishlistIds.includes(g.id) ? 'currentColor' : 'none'} />{wishlistIds.includes(g.id) ? 'บันทึกไว้แล้ว' : 'บันทึกที่สนใจ'}</button><Link to={`/games/${g.id}`} className="text-link">รายละเอียดเกม <ArrowUpRight size={15} /></Link></div>}</td>)}</tr>
        </tbody></table></div>
        <div className="compare-bottom"><Link to="/" className="back-link"><ArrowLeft size={16} /> กลับไปเลือกเกมที่หน้าร้าน</Link><p>เลือกเพิ่มหรือเปลี่ยนเกมได้จากช่องด้านบน</p></div>
      </>}
  </div>;
}
