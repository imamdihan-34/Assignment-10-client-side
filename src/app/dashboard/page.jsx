'use client';

import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useAuth } from '@/app/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">
          Welcome {user?.fullName}
        </h1>

        <p className="mt-2">
          Role: {user?.role}
        </p>
      </div>
    </div>
  );
}