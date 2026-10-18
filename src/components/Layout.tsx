import { useEffect } from 'react';
import { ArrowRight, Disc3, GitCompareArrows, Heart, X } from 'lucide-react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamesOptions } from '../api/games';
import { useShopStore } from '../stores/shop';

export function Layout() {
  const wishlistIds = useShopStore(s => s.wishlistIds);
  const compareIds = useShopStore(s => s.compareIds);
  const notice = useShopStore(s => s.notice);
  const dismiss = useShopStore(s => s.dismissNotice);
  const location = useLocation();
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [notice, dismiss]);
  return <div className={`site-shell ${compareIds.length && location.pathname !== '/compare' ? 'with-tray' : ''}`}>
    <a className="skip-link" href="#main">ข้ามไปเนื้อหา</a>
    <header className="site-header">
      <div className="header-inner navbar">
        <Link to="/" className="brand" aria-label="Discs for Sale หน้าร้าน"><span className="brand-icon"><Disc3 size={27} /></span><span>DISCS <span className="brand-light">FOR SALE</span></span></Link>
        <nav aria-label="เมนูหลัก">
          <NavLink to="/" end>หน้าร้าน</NavLink>
          <NavLink to="/wishlist"><Heart size={16} /><span>ที่สนใจ</span><span className="nav-count">{wishlistIds.length}</span></NavLink>
          <NavLink to="/compare"><GitCompareArrows size={16} /><span>เปรียบเทียบ</span><span className="nav-count">{compareIds.length}</span></NavLink>
          <NavLink to="/about">เกี่ยวกับเรา</NavLink>
        </nav>
        <span className="header-platform">PLAYSTATION 5</span>
      </div>
    </header>
    <main id="main" className="main-content" tabIndex={-1}><Outlet /></main>
    <footer className="site-footer"><div className="container footer-inner">
      <Link to="/" className="footer-brand"><Disc3 size={20} /> DISCS FOR SALE</Link>
      <p>ร้านแผ่นเกม PS5 จำลองเพื่อการศึกษา · ราคาและสต็อกไม่ใช่ข้อเสนอขายจริง</p>
      <Link to="/about">ข้อมูลผู้พัฒนาและแหล่งอ้างอิง <ArrowRight size={14} /></Link>
    </div></footer>
    {location.pathname !== '/compare' && compareIds.length > 0 && <CompareTray />}
    <div className="toast toast-top toast-center notice-toast" role="status" aria-live="polite">
      {notice && <div className="alert notice-box"><span>{notice.message}</span><button onClick={dismiss} aria-label="ปิดข้อความ"><X size={18} /></button></div>}
    </div>
    <ScrollRestoration />
  </div>;
}

function CompareTray() {
  const ids = useShopStore(s => s.compareIds);
  const toggle = useShopStore(s => s.toggleCompare);
  const clear = useShopStore(s => s.clearCompare);
  const { data } = useQuery(gamesOptions);
  return <aside className="compare-tray" aria-label="เกมที่เลือกเปรียบเทียบ">
    <div className="container tray-inner"><div className="tray-label"><GitCompareArrows size={22} /><div><strong>เลือกแล้ว {ids.length}/2 เกม</strong><span>เลือกได้สูงสุด 2 เกม</span></div></div>
      <div className="tray-games">{ids.map(id => {
        const game = data?.find(g => g.id === id);
        return <div className="tray-game" key={id}>{game && <img src={game.cover} alt="" />}<span>{game?.title ?? `เกม #${id}`}</span><button onClick={() => toggle(id)} aria-label={`นำ ${game?.title ?? id} ออกจากการเปรียบเทียบ`}><X size={16} /></button></div>;
      })}</div>
      <div className="tray-actions"><button className="btn btn-ghost btn-sm" onClick={clear}>ล้าง</button>
        {ids.length === 2 ? <Link className="btn btn-primary" to="/compare">เปรียบเทียบ 2 เกม <ArrowRight size={16} /></Link>
          : <button className="btn btn-primary" disabled>เลือกอีก 1 เกม</button>}
      </div>
    </div>
  </aside>;
}
