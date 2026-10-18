import { AlertCircle, ArrowRight, RefreshCw, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function ErrorState({ error, retry }: { error: Error; retry: () => void }) {
  return <div className="state-panel" role="alert">
    <AlertCircle size={38} />
    <h2>โหลดข้อมูลไม่สำเร็จ</h2>
    <p>{error.message}</p>
    <button className="btn btn-primary" onClick={retry}><RefreshCw size={16} /> ลองอีกครั้ง</button>
  </div>;
}

export function LoadingCards({ count = 8 }: { count?: number }) {
  return <div role="status" aria-label="กำลังโหลดข้อมูลเกม">
    <span className="sr-only">กำลังโหลดข้อมูลเกม</span>
    <div className="games-grid">{Array.from({ length: count }, (_, i) =>
      <div className="card bg-base-100 p-4 gap-4" key={i} aria-hidden="true">
        <div className="skeleton aspect-[4/5] w-full rounded-xl" />
        <div className="skeleton h-5 w-4/5" /><div className="skeleton h-4 w-2/5" />
        <div className="skeleton h-11 w-full" />
      </div>)}</div>
  </div>;
}

export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="state-panel"><SearchX size={40} /><h2>{title}</h2><p>{children}</p>
    {action ?? <Link className="btn btn-primary" to="/">ไปเลือกเกม <ArrowRight size={16} /></Link>}
  </div>;
}
