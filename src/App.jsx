import { HashRouter, Routes, Route } from 'react-router-dom';
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Explore from './pages/Explore';
import ClubDetail from './pages/ClubDetail';
import Apply from './pages/Apply';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminStats from './pages/admin/Stats';
import AdminClubEdit from './pages/admin/ClubEdit';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Student routes */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/club/:id/apply" element={<Apply />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/club" element={<AdminClubEdit />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
