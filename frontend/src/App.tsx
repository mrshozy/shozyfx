import './App.css';
import Router from './routes';
import { useScrollToTop } from './hooks/useScroll.ts';

function App() {
  useScrollToTop();
  return (
    <Router  />
  );
}

export default App;
