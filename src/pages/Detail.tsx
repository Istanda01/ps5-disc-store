import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, GitCompareArrows, Heart, Package, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, gameOptions } from '../api/games';
import { useShopStore } from '../stores/shop';
import { formatDate, formatPrice } from '../lib/catalog';
import { Cover } from '../components/Cover';
import { EmptyState, ErrorState } from '../components/Feedback';

export function DetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useQuery(gameOptions(id));
  const saved = useShopStore(s => s.wishlistIds.includes(id));
  const compared = useShopStore(s => s.compareIds.includes(id));
  const toggleWishlist = useShopStore(s => s.toggleWishlist);
  const toggleCompare = useShopStore(s => s.toggleCompare);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  function goBack() {
    if (typeof window.history.state?.idx === 'number' && window.history.state.idx > 0) {
      void navigate(-1);
    } else {
      void navigate('/');
    }
  }

  function handleScroll(direction: 'left' | 'right') {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  // ดึงรายการรูป: ถ้ามี screenshots ให้ใช้ ถ้าไม่มีให้ใช้ banner หรือ fallback เป็น cover
  const gameData = query.data;
  const rawScreenshots = (gameData as { screenshots?: string[] } | undefined)?.screenshots;
  const imageList = rawScreenshots && rawScreenshots.length > 0
    ? rawScreenshots
    : [gameData?.banner || gameData?.cover || ''];

  // ระบบเลื่อนภาพอัตโนมัติทุกๆ 4 วินาที (จะหยุดชั่วคราวเมื่อนำเมาส์ไปชี้)
  useEffect(() => {
    if (imageList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [imageList.length, isPaused]);

  return (
    <div className="container inner-page">
      <button className="back-link" onClick={goBack}>
        <ArrowLeft size={17} /> กลับไปหน้าก่อนหน้า
      </button>

      {query.isPending ? (
        <div className="detail-grid" role="status" aria-label="กำลังโหลดรายละเอียด">
          <div className="skeleton detail-skeleton" />
          <div className="space-y-6">
            <div className="skeleton h-12 w-4/5" />
            <div className="skeleton h-8 w-1/3" />
            <div className="skeleton h-52 w-full" />
          </div>
        </div>
      ) : query.isError ? (
        query.error instanceof ApiError && query.error.status === 404 ? (
          <EmptyState title="ไม่พบเกมนี้">
            เกมนี้อาจถูกนำออกจากรายการ กรุณากลับไปเลือกเกมอื่น
          </EmptyState>
        ) : (
          <ErrorState
            error={query.error}
            retry={() => {
              void query.refetch();
            }}
          />
        )
      ) : (
        <>
          <nav className="breadcrumbs text-sm" aria-label="ตำแหน่งหน้า">
            <ul>
              <li>
                <Link to="/">หน้าร้าน</Link>
              </li>
              <li>{query.data.title}</li>
            </ul>
          </nav>

          {/* สไลเดอร์ภาพแนวนอนด้านบน พร้อม Event หยุดเลื่อนเมื่อเมาส์ชี้ */}
          <div 
            className="banner-slider-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="banner-slider-track" ref={sliderRef}>
              {imageList.map((imgSrc, index) => (
                <div className="banner-slide" key={index}>
                  <img
                    src={imgSrc}
                    alt={`${query.data.title} visual ${index + 1}`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== query.data.cover) {
                        target.src = query.data.cover;
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* แสดงปุ่มเลื่อนซ้าย-ขวา เฉพาะเมื่อมีรูปมากกว่า 1 รูป */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  className="slider-nav-btn prev"
                  onClick={() => handleScroll('left')}
                  aria-label="ดูภาพก่อนหน้า"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="slider-nav-btn next"
                  onClick={() => handleScroll('right')}
                  aria-label="ดูภาพถัดไป"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-cover">
              <Cover key={id} src={query.data.cover} title={query.data.title} eager />
            </div>

            <article className="detail-copy">
              <span className="section-kicker">PLAYSTATION 5 · PHYSICAL DISC</span>
              <h1>{query.data.title}</h1>
              <div className="detail-tags">
                <span className="badge badge-outline">{query.data.genre}</span>
                {query.data.featured && (
                  <span className="badge badge-primary badge-soft">ร้านแนะนำ</span>
                )}
              </div>
              <div className="detail-price">
                {formatPrice(query.data.price)}
                <span>ราคาจำลองสำหรับโครงงาน</span>
              </div>
              <section className="game-description">
                <h2>เกี่ยวกับเกมนี้</h2>
                <p>{query.data.description}</p>
              </section>
              <dl className="game-specs">
                <div>
                  <dt>ประเภทเกม</dt>
                  <dd>{query.data.genre}</dd>
                </div>
                <div>
                  <dt>จำนวนผู้เล่น</dt>
                  <dd>{query.data.players}</dd>
                </div>
                <div>
                  <dt>แพลตฟอร์ม</dt>
                  <dd>{query.data.platform}</dd>
                </div>
                <div>
                  <dt>รูปแบบสินค้า</dt>
                  <dd>{query.data.format}</dd>
                </div>
                <div>
                  <dt>วันวางจำหน่าย PS5</dt>
                  <dd>{formatDate(query.data.releaseDate)}</dd>
                </div>
                <div>
                  <dt>ผู้จัดจำหน่าย</dt>
                  <dd>{query.data.publisher}</dd>
                </div>
              </dl>
              <div className="detail-actions">
                <button
                  className={`btn ${saved ? 'btn-soft btn-primary' : 'btn-primary'}`}
                  onClick={() => toggleWishlist(id)}
                  aria-pressed={saved}
                >
                  <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'บันทึกไว้แล้ว' : 'บันทึกเกมที่สนใจ'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => toggleCompare(id)}
                  aria-pressed={compared}
                >
                  {compared ? <Check size={18} /> : <GitCompareArrows size={18} />}
                  {compared ? 'เลือกเปรียบเทียบแล้ว' : 'เพิ่มเพื่อเปรียบเทียบ'}
                </button>
              </div>
              <div className="detail-benefits">
                <span>
                  <Package size={17} /> รูปแบบแผ่นเกม
                </span>
                <span>
                  <Users size={17} /> {query.data.players}
                </span>
              </div>
            </article>
          </div>
        </>
      )}
    </div>
  );
}