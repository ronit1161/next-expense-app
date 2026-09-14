import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient';

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
