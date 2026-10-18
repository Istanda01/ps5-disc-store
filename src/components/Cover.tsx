import { useState } from 'react';

export function Cover({ src, title, eager = false }: { src: string; title: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className="game-cover">
    <div className="ps5-strip"><strong>PS5</strong><span>PHYSICAL DISC</span></div>
    {failed ? <div className="cover-fallback"><span>PS5</span><strong>{title}</strong></div>
      : <img src={src} alt={`ภาพประกอบเกม ${title}`} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />}
  </div>;
}
