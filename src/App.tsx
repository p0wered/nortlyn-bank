import { HomePage } from './pages/HomePage/HomePage.tsx';
import { AppPage } from './pages/AppPage/AppPage.tsx';

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/app') {
    return <AppPage />;
  }

  return <HomePage />;
}
