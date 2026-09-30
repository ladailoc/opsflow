import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/tickets/PriorityBadge';

export interface PriorityMatrixHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PriorityMatrixHelp({ isOpen, onClose }: PriorityMatrixHelpProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Priority Calculation Matrix"
      description="In OpsFlow, Priority (P1–P4) is strictly calculated from Impact and Urgency. It cannot be edited directly."
      maxWidth="lg"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Close Matrix
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-center border-collapse text-caption">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th className="py-2.5 px-3 text-left font-semibold text-text-primary border-r border-border">
                  Impact \ Urgency
                </th>
                <th className="py-2.5 px-3 font-semibold text-text-primary border-r border-border">
                  High Urgency
                </th>
                <th className="py-2.5 px-3 font-semibold text-text-primary border-r border-border">
                  Medium Urgency
                </th>
                <th className="py-2.5 px-3 font-semibold text-text-primary">
                  Low Urgency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2.5 px-3 text-left font-medium text-text-primary border-r border-border bg-bg-subtle/30">
                  High Impact (50+ users)
                </td>
                <td className="py-2.5 px-3 border-r border-border bg-red-50/40">
                  <PriorityBadge priority="P1" showLabel />
                </td>
                <td className="py-2.5 px-3 border-r border-border">
                  <PriorityBadge priority="P2" showLabel />
                </td>
                <td className="py-2.5 px-3">
                  <PriorityBadge priority="P3" showLabel />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-left font-medium text-text-primary border-r border-border bg-bg-subtle/30">
                  Medium Impact (2–49 users)
                </td>
                <td className="py-2.5 px-3 border-r border-border">
                  <PriorityBadge priority="P2" showLabel />
                </td>
                <td className="py-2.5 px-3 border-r border-border">
                  <PriorityBadge priority="P3" showLabel />
                </td>
                <td className="py-2.5 px-3">
                  <PriorityBadge priority="P4" showLabel />
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-left font-medium text-text-primary border-r border-border bg-bg-subtle/30">
                  Low Impact (1 user)
                </td>
                <td className="py-2.5 px-3 border-r border-border">
                  <PriorityBadge priority="P3" showLabel />
                </td>
                <td className="py-2.5 px-3 border-r border-border">
                  <PriorityBadge priority="P4" showLabel />
                </td>
                <td className="py-2.5 px-3">
                  <PriorityBadge priority="P4" showLabel />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3 text-caption">
          <div className="p-3 bg-bg-subtle rounded border border-border space-y-1">
            <span className="font-semibold text-text-primary">Impact Levels</span>
            <ul className="list-disc pl-4 text-text-secondary space-y-0.5">
              <li><strong>High:</strong> 50+ users or company-wide disruption</li>
              <li><strong>Medium:</strong> 2–49 users affected</li>
              <li><strong>Low:</strong> Single user affected</li>
            </ul>
          </div>
          <div className="p-3 bg-bg-subtle rounded border border-border space-y-1">
            <span className="font-semibold text-text-primary">Urgency Levels</span>
            <ul className="list-disc pl-4 text-text-secondary space-y-0.5">
              <li><strong>High:</strong> Work blocked completely, no workaround</li>
              <li><strong>Medium:</strong> Partially hindered, workaround inconvenient</li>
              <li><strong>Low:</strong> Planned or non-blocking request</li>
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
