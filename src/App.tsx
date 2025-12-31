import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStartedPage from './pages/GetStartedPage';
import CheckWithAIPage from './pages/CheckWithAIPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ContributorLoginPage from './pages/ContributorLoginPage';
import ContributorSignupPage from './pages/ContributorSignupPage';
import ContributorDashboardPage from './pages/ContributorDashboardPage';
import ManufacturingDashboardPage from './pages/ManufacturingDashboardPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/check-with-ai" element={<CheckWithAIPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/contributor-login" element={<ContributorLoginPage />} />
            <Route path="/contributor-signup" element={<ContributorSignupPage />} />
            <Route path="/contributor-dashboard" element={<ContributorDashboardPage />} />
            <Route path="/manufacturing-dashboard" element={<ManufacturingDashboardPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
