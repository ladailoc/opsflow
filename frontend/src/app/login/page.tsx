'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '@/mocks/users';

export default function LoginPage() {
  const router = useRouter();
  const { state, setActiveUser } = usePrototype();

  const [email, setEmail] = useState('alex.nguyen@opsflow.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<'NONE' | 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED'>('NONE');
  const [lockedUser, setLockedUser] = useState<User | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState('NONE');

    setTimeout(() => {
      setIsLoading(false);

      // Check if user exists in mock store
      const matchedUser = state.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matchedUser) {
        setErrorState('INVALID_CREDENTIALS');
        return;
      }

      // Check locked status
      if (matchedUser.status === 'LOCKED') {
        setErrorState('ACCOUNT_LOCKED');
        setLockedUser(matchedUser);
        return;
      }

      // Success
      setActiveUser(matchedUser.id);
      if (matchedUser.role === 'EMPLOYEE') {
        router.push('/employee/tickets');
      } else if (matchedUser.role === 'SUPPORT_AGENT') {
        router.push('/agent/queue');
      } else if (matchedUser.role === 'ADMINISTRATOR') {
        router.push('/admin/dashboard');
      }
    }, 600);
  };

  const handleQuickLogin = (user: User) => {
    setEmail(user.email);
    setPassword('••••••••••••');

    if (user.status === 'LOCKED') {
      setErrorState('ACCOUNT_LOCKED');
      setLockedUser(user);
      return;
    }

    setErrorState('NONE');
    setActiveUser(user.id);

    if (user.role === 'EMPLOYEE') {
      router.push('/employee/tickets');
    } else if (user.role === 'SUPPORT_AGENT') {
      router.push('/agent/queue');
    } else if (user.role === 'ADMINISTRATOR') {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-bg-canvas flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[420px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-text-inverse shadow-subtle mb-1">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-display font-bold text-text-primary tracking-tight">OpsFlow</h1>
          <p className="text-heading-2 font-semibold text-text-primary">Welcome back</p>
          <p className="text-body text-text-secondary">
            Sign in to manage internal IT support requests.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-5">
          {/* Variant: Invalid Credentials Alert */}
          {errorState === 'INVALID_CREDENTIALS' && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-caption text-red-900 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Invalid email or password</p>
                <p className="text-red-800/90">Please check your login details and try again.</p>
              </div>
            </div>
          )}

          {/* Variant: Account Locked Alert */}
          {errorState === 'ACCOUNT_LOCKED' && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-caption text-amber-950 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account Suspended</p>
                <p className="text-amber-900/90">
                  The account for <strong>{lockedUser?.name || email}</strong> has been locked by an Administrator. Please contact IT Ops for reinstatement.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@opsflow.internal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorState !== 'NONE') setErrorState('NONE');
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorState !== 'NONE') setErrorState('NONE');
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in
            </Button>
          </form>

          {/* Subtle State Tester Buttons for Evaluators */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
            <span>Simulate State:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setErrorState('INVALID_CREDENTIALS')}
                className="hover:underline text-text-secondary"
              >
                Error
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setErrorState('ACCOUNT_LOCKED');
                  setLockedUser(state.users.find((u) => u.status === 'LOCKED') || null);
                }}
                className="hover:underline text-text-secondary"
              >
                Locked
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setErrorState('NONE')}
                className="hover:underline text-primary"
              >
                Default
              </button>
            </div>
          </div>
        </div>

        {/* Prototype 1-Click Persona Access */}
        <div className="space-y-2">
          <p className="text-caption font-semibold text-text-muted uppercase tracking-wider text-center">
            Prototype Quick Access Personas
          </p>
          <div className="grid grid-cols-1 gap-2">
            {state.users.slice(0, 4).map((user) => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-surface hover:bg-bg-subtle/80 hover:border-border-strong text-left transition-all group shadow-subtle"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-caption font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      user.role === 'ADMINISTRATOR'
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : user.role === 'SUPPORT_AGENT'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.status === 'LOCKED' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                      LOCKED
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
