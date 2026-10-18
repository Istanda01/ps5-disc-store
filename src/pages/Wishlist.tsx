import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { gamesOptions } from '../api/games';
import { useShopStore } from '../stores/shop';
import { GameCard } from '../components/GameCard';
import { EmptyState, ErrorState, LoadingCards } from '../components/Feedback';

export function WishlistPage() {
  const ids = useShopStore(s => s.wishlistIds);
  const toggle = useShopStore(s => s.toggleWishlist);
  const query = useQuery({ ...gamesOptions, enabled: ids.length > 0 });
  const games = ids.map(id => query.data?.find(g => g.id === id)).filter(g => g !== undefined);
  const missing = query.data ? ids.filter(id => !query.data.some(g => g.id === id)) : [];
  return <div className="container inner-page">
    <div className="page-heading"><div><span className="section-kicker">YOUR PERSONAL COLLECTION</span><h1>เกมที่คุณสนใจ <Heart size={30} /></h1><p>เก็บเกมที่อยากเล่น แล้วค่อยกลับมาเลือกในวันที่พร้อม</p></div><span className="count-pill">{ids.length} เกมที่บันทึก</span></div>
    {ids.length === 0 ? <EmptyState title="ยังไม่มีเกมในรายการที่สนใจ">กดหัวใจบนเกมที่ชอบ เพื่อเก็บไว้ดูภายหลัง</EmptyState>
      : query.isPending ? <LoadingCards count={4} /> : query.isError ? <ErrorState error={query.error} retry={() => { void query.refetch(); }} />
      : <><div className="games-grid">{games.map(game => <GameCard key={game.id} game={game} />)}</div>
        {missing.length > 0 && <div className="missing-panel"><p>มี {missing.length} เกมที่ไม่อยู่ในแค็ตตาล็อกแล้ว</p><button className="btn btn-outline btn-sm" onClick={() => missing.forEach(toggle)}>นำรายการที่ไม่พบออก</button></div>}
        <p className="collection-note">รายการนี้บันทึกไว้ในเบราว์เซอร์ของคุณ เปิดเว็บครั้งถัดไปแล้วกลับมาดูได้</p></>}
  </div>;
}
