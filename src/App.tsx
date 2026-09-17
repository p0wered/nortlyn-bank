import { HomePage } from './pages/HomePage';
import { AppPage } from './pages/AppPage';

export function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/app') {
    return <AppPage />;
  }

  return <HomePage />;
}
