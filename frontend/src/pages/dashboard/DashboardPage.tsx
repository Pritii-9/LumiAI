import { useUser } from '@/context/UserContext';
import WelcomeContainer from '@/components/dashboard/WelcomeContainer';
import LatestInterviewList from '@/components/dashboard/LatestInterviewList';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div>
      <WelcomeContainer user={user} />
      <AnalyticsDashboard />
      <LatestInterviewList />
    </div>
  );
}
