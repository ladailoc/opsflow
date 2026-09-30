'use client';

import React, { useState } from 'react';
import { usePrototype } from '@/prototype/PrototypeProvider';
import { User } from '@/mocks/users';
import { ConflictScenarioType } from '@/prototype/state';
import {
  RotateCcw,
  Zap,
  Users,
  ChevronDown,
  ShieldAlert,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrototypeToolbar() {
  const { state, activeUser, setActiveUser, resetState, dispatch } = usePrototype();
  const [isOpen, setIsOpen] = useState(true);

  // In Next.js, check prototype mode (default to true for this prototype)
  const isPrototypeMode = process.env.NEXT_PUBLIC_PROTOTYPE_MODE !== 'false';
  if (!isPrototypeMode) return null;

  const handleSimulateConflict = (scenario: ConflictScenarioType) => {
    let ticketId = 't-00124';
    if (scenario === 'TAKE_COLLISION') {
      ticketId = 't-00128'; // unassigned ticket
    } else if (scenario === 'TICKET_CHANGED') {
      ticketId = 't-00124';
    } else if (scenario === 'EDIT_START_COLLISION') {
      ticketId = 't-00129'; // ticket in NEW
    } else if (scenario === 'RESOLVE_REJECTED') {
      ticketId = 't-00130'; // ticket in CANCELLED
    } else if (scenario === 'CANCEL_REJECTED' || scenario === 'CANCEL_RESOLVE_COLLISION') {
      ticketId = 't-00126'; // ticket in RESOLVED
    }

    dispatch({
      type: 'SIMULATE_CONFLICT',
      payload: {
        scenario,
        ticketId,
        draftData:
          scenario === 'EDIT_START_COLLISION'
            ? {
                title: 'GitLab repository push rejected with 403 Forbidden [DRAFT UPDATE]',
                description: 'Updated with additional diagnostics: Pre-receive hook returned exit code 1 on branch release-v2.3.',
              }
            : undefined,
      },
    });
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-caption py-1.5 px-4 select-none shrink-0 z-40 relative">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Left Branding */}
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/40 uppercase tracking-widest">
            PROTOTYPE TOOLBAR (DEV ONLY)
          </span>
          <span className="text-slate-400 text-[12px] hidden sm:inline">
            Active persona: <strong className="text-white">{activeUser.name}</strong> ({activeUser.role})
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick User Persona Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[12px]">Switch Persona:</span>
            <select
              value={activeUser.id}
              onChange={(e) => setActiveUser(e.target.value)}
              className="h-6 px-2 rounded bg-slate-800 text-white border border-slate-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <optgroup label="Employee">
                <option value="user-emp-01">Alex Nguyen (Employee)</option>
                <option value="user-emp-02">Lan Hoang (Employee)</option>
              </optgroup>
              <optgroup label="Support Agent">
                <option value="user-agt-01">Maya Chen (Support Agent)</option>
                <option value="user-agt-02">Daniel Tran (Support Agent)</option>
                <option value="user-agt-04">Linh Pham (Agent - LOCKED)</option>
              </optgroup>
              <optgroup label="Administrator">
                <option value="user-adm-01">Sarah Lee (Administrator)</option>
              </optgroup>
            </select>
          </div>

          {/* Trigger Conflict Simulation */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[12px]">Simulate Conflict:</span>
            <button
              onClick={() => handleSimulateConflict('TAKE_COLLISION')}
              title="Simulate 2 agents taking the same ticket simultaneously"
              className="h-6 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Take vs Take
            </button>
            <button
              onClick={() => handleSimulateConflict('TICKET_CHANGED')}
              title="Simulate ticket changed since opened"
              className="h-6 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Ticket Changed
            </button>
            <button
              onClick={() => handleSimulateConflict('EDIT_START_COLLISION')}
              title="Simulate employee editing while agent starts processing"
              className="h-6 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Edit vs Start
            </button>
            <button
              onClick={() => handleSimulateConflict('CANCEL_REJECTED')}
              title="Simulate Cancel rejected because ticket was resolved"
              className="h-6 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Cancel vs Resolve
            </button>
            <button
              onClick={() => handleSimulateConflict('RESOLVE_REJECTED')}
              title="Simulate Resolve rejected because ticket was cancelled"
              className="h-6 px-2 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Resolve vs Cancel
            </button>
          </div>

          {/* Reset Mock Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all prototype tickets and mock data to initial seeds?')) {
                resetState();
              }
            }}
            className="h-6 px-2 rounded bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 text-[11px] inline-flex items-center gap-1 transition-colors"
            title="Reset tickets, comments, and audit history to clean defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
