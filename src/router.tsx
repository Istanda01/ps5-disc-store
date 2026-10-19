import { createHashRouter, Link, useRouteError } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StorePage } from './pages/Store';
import { DetailPage } from './pages/Detail';
import { WishlistPage } from './pages/Wishlist';
import { ComparePage } from './pages/Compare';
import { AboutPage } from './pages/About';
import { NotFoundPage } from './pages/NotFound';
 
function RouteError() {
  const error: unknown = useRouteError();
  return (
<div className="state-panel">
<h1>ไม่สามารถแสดงหน้านี้ได้</h1>
<p>{error instanceof Error ? error.message : 'กรุณาลองเปิดหน้าเว็บใหม่'}</p>
<Link className="btn btn-primary" to="/">กลับหน้าร้าน</Link>
</div>
  );
}
 
export const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <RouteError />,
  children: [
    { index: true, element: <StorePage /> },
    { path: 'games/:id', element: <DetailPage /> },
    { path: 'wishlist', element: <WishlistPage /> },
    { path: 'compare', element: <ComparePage /> },
    { path: 'about', element: <AboutPage /> },
    { path: '*', element: <NotFoundPage /> }
  ]
}];
 
export function createAppRouter() { 
  return createHashRouter(routes); 
}