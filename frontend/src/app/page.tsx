'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrototype } from '@/prototype/PrototypeProvider';

export default function RootPage() {
  const router = useRouter();
  const { activeUser } = usePrototype();

  useEffect(() => {
    if (activeUser.role === 'EMPLOYEE') {
      router.replace('/employee/tickets');
    } else if (activeUser.role === 'SUPPORT_AGENT') {
      router.replace('/agent/queue');
    } else if (activeUser.role === 'ADMINISTRATOR') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/login');
    }
  }, [activeUser, router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-bg-canvas text-caption text-text-muted">
      Redirecting to your workspace...
    </div>
  );
}
