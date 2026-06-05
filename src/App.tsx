import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import Home        from './pages/Home';
import Memory      from './pages/Memory';
import WordImage   from './pages/WordImage';
import Letters     from './pages/Letters';
import Hearing     from './pages/Hearing';
import Categories  from './pages/Categories';
import Quiz        from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import WhoAmI      from './pages/WhoAmI';

export default function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/memory"      element={<Memory />} />
        <Route path="/word-image"  element={<WordImage />} />
        <Route path="/letters"     element={<Letters />} />
        <Route path="/hearing"     element={<Hearing />} />
        <Route path="/categories"  element={<Categories />} />
        <Route path="/quiz"        element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/who-am-i"   element={<WhoAmI />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </ProfileProvider>
  );
}
