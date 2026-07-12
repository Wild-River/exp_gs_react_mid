// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // これの影響で開発環境ではuseEffectの関数が2回実行、本番では1回になるから入れておくこと！
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
