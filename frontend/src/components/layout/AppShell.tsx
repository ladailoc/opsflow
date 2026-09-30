import React from 'react';
import { AppSidebar } from './AppSidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full min-h-screen bg-bg-canvas text-text-primary overflow-hidden">
      <AppSidebar />
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-8 max-w-[1440px]">
        {children}
      </main>
    </div>
  );
}
