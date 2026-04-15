import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TravelDetailPage } from './pages/TravelDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/travels/:id" element={<TravelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
