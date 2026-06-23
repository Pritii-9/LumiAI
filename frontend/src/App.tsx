import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/UserContext';
import { InterviewDataProvider } from '@/context/InterviewDataContext';

// Pages
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CreateInterviewPage from '@/pages/dashboard/CreateInterviewPage';
import ScheduledInterviewPage from '@/pages/ScheduledInterviewPage';
import AllInterviewPage from '@/pages/AllInterviewPage';
import BillingPage from '@/pages/BillingPage';
import SettingsPage from '@/pages/SettingsPage';
import InterviewJoinPage from '@/pages/interview/InterviewJoinPage';
import InterviewStartPage from '@/pages/interview/InterviewStartPage';
import InterviewCompletedPage from '@/pages/interview/InterviewCompletedPage';
import InterviewDetailsPage from '@/pages/scheduled/InterviewDetailsPage';

function App() {
  return (
    <UserProvider>
      <InterviewDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Interview flow (no sidebar) */}
            <Route path="/interview/:interview_id" element={<InterviewJoinPage />} />
            <Route path="/interview/:interview_id/start" element={<InterviewStartPage />} />
            <Route path="/interview/:interview_id/completed" element={<InterviewCompletedPage />} />

            {/* Protected dashboard routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/create-interview" element={<CreateInterviewPage />} />
              <Route path="/scheduled-interview" element={<ScheduledInterviewPage />} />
              <Route path="/scheduled-interview/:interview_id/details" element={<InterviewDetailsPage />} />
              <Route path="/all-interview" element={<AllInterviewPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </InterviewDataProvider>
    </UserProvider>
  );
}

export default App;
