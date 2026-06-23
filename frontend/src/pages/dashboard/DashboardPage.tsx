import { useUser } from '@/context/UserContext';
import WelcomeContainer from '@/components/dashboard/WelcomeContainer';
import LatestInterviewList from '@/components/dashboard/LatestInterviewList';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div>
      <WelcomeContainer user={user} />
      <LatestInterviewList />
    </div>
  );
}
