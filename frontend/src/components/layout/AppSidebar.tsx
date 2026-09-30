'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  PlusCircle,
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  LifeBuoy,
  LogOut,
  Palette,
  CheckCircle,
} from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const { activeUser } = usePrototype();

  const employeeNav = [
    { label: 'My Tickets', href: '/employee/tickets', icon: Inbox },
    { label: 'New Request', href: '/employee/tickets/new', icon: PlusCircle },
  ];

  const agentNav = [
    { label: 'Support Queue', href: '/agent/queue', icon: LifeBuoy },
  ];

  const adminNav = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Ticket Directory', href: '/admin/tickets', icon: Inbox },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Request Types', href: '/admin/request-types', icon: Layers },
  ];

  let currentNav = employeeNav;
  if (activeUser.role === 'SUPPORT_AGENT') {
    currentNav = agentNav;
  } else if (activeUser.role === 'ADMINISTRATOR') {
    currentNav = adminNav;
  }

  return (
    <aside className="w-60 min-w-[240px] max-w-[240px] h-screen bg-bg-surface border-r border-border flex flex-col justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary text-text-inverse flex items-center justify-center font-bold text-heading-2 shadow-subtle">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-heading-3 text-text-primary tracking-tight leading-none">
              OpsFlow
            </span>
            <span className="text-[11px] text-text-muted leading-tight font-medium">
              Enterprise IT Service
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            {activeUser.role === 'SUPPORT_AGENT'
              ? 'Agent Workspace'
              : activeUser.role === 'ADMINISTRATOR'
              ? 'Administration'
              : 'Service Portal'}
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-body font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50/80 text-primary font-semibold border-l-2 border-primary -ml-[2px] rounded-l-none'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-primary' : 'text-text-muted'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Quick Design System Catalog Link */}
          <div className="pt-4 border-t border-border/60 mt-4">
            <div className="px-2 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Prototype Tools
            </div>
            <Link
              href="/design-system"
              className={cn(
                'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-caption font-medium transition-colors',
                pathname === '/design-system'
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
              )}
            >
              <Palette className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Design System Showroom</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Area at Bottom */}
      <div className="p-3 border-t border-border bg-bg-surface">
        <div className="flex items-center justify-between p-2 rounded-lg bg-bg-subtle/70 border border-border/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold text-caption shrink-0"
              style={{ backgroundColor: activeUser.avatarColor || '#2563EB' }}
            >
              {activeUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-caption font-semibold text-text-primary truncate">
                {activeUser.name}
              </p>
              <p className="text-[11px] text-text-muted truncate">
                {activeUser.role === 'SUPPORT_AGENT'
                  ? 'Support Agent'
                  : activeUser.role === 'ADMINISTRATOR'
                  ? 'Administrator'
                  : 'Employee'}
              </p>
            </div>
          </div>
          <Link
            href="/login"
            title="Switch User / Sign out"
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-border/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
