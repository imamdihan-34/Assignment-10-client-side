'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const role = user.role?.toLowerCase();

  const userMenu = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Hiring History',
      href: '/dashboard/user/hiring-history',
    },
    {
      title: 'Comments',
      href: '/dashboard/user/comments',
    },
    {
      title: 'Update Profile',
      href: '/dashboard/user/update-profile',
    },
  ];

  const lawyerMenu = [
    {
      title: 'Dashboard',
      href: '/dashboard/user/lawyer',
    },
    {
      title: 'Hiring Requests',
      href: '/dashboard/user/lawyer/hiring-history',
    },
    {
      title: 'Manage Legal Profile',
      href: '/dashboard/user/lawyer/manage-legal-profile',
    },
    {
      title: 'Update Profile',
      href: '/dashboard/user/update-profile',
    },
  ];

  const adminMenu = [
    {
      title: 'Dashboard',
      href: '/dashboard/user/admin',
    },
    {
      title: 'Analytics',
      href: '/dashboard/user/admin/analytics',
    },
    {
      title: 'Manage Users',
      href: '/dashboard/user/admin/manage-users',
    },
    {
      title: 'All Transactions',
      href: '/dashboard/user/admin/all-transactions',
    },
  ];

  let menus = userMenu;

  if (role === 'lawyer') menus = lawyerMenu;

  if (role === 'admin') menus = adminMenu;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">

      <div className="p-6 border-b border-slate-700">

        <h2 className="text-2xl font-bold">
          LegalEase
        </h2>

        <p className="text-sm text-slate-300 mt-2">
          {user.fullName}
        </p>

        <span className="text-xs bg-blue-600 px-2 py-1 rounded mt-2 inline-block capitalize">
          {role}
        </span>

      </div>

      <div className="p-4 space-y-2">

        {menus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === item.href
                ? 'bg-blue-600'
                : 'hover:bg-slate-700'
            }`}
          >
            {item.title}
          </Link>
        ))}

        <button
          onClick={logout}
          className="w-full mt-5 bg-red-500 hover:bg-red-600 rounded-lg px-4 py-3"
        >
          Logout
        </button>

      </div>
    </aside>
  );
}