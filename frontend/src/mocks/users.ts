export type Role = 'EMPLOYEE' | 'SUPPORT_AGENT' | 'ADMINISTRATOR';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  department: string;
  avatarColor: string;
  activeTicketCount?: number;
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-emp-01',
    name: 'Alex Nguyen',
    email: 'alex.nguyen@opsflow.internal',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    department: 'Engineering',
    avatarColor: '#2563EB',
  },
  {
    id: 'user-emp-02',
    name: 'Lan Hoang',
    email: 'lan.hoang@opsflow.internal',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    department: 'Finance',
    avatarColor: '#7C3AED',
  },
  {
    id: 'user-emp-03',
    name: 'David Vu',
    email: 'david.vu@opsflow.internal',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    department: 'Marketing',
    avatarColor: '#059669',
  },
  {
    id: 'user-agt-01',
    name: 'Maya Chen',
    email: 'maya.chen@opsflow.internal',
    role: 'SUPPORT_AGENT',
    status: 'ACTIVE',
    department: 'IT Support',
    avatarColor: '#D97706',
    activeTicketCount: 3,
  },
  {
    id: 'user-agt-02',
    name: 'Daniel Tran',
    email: 'daniel.tran@opsflow.internal',
    role: 'SUPPORT_AGENT',
    status: 'ACTIVE',
    department: 'IT Support',
    avatarColor: '#0284C7',
    activeTicketCount: 2,
  },
  {
    id: 'user-agt-03',
    name: 'Minh Le',
    email: 'minh.le@opsflow.internal',
    role: 'SUPPORT_AGENT',
    status: 'ACTIVE',
    department: 'IT Support',
    avatarColor: '#4F46E5',
    activeTicketCount: 1,
  },
  {
    id: 'user-agt-04',
    name: 'Linh Pham',
    email: 'linh.pham@opsflow.internal',
    role: 'SUPPORT_AGENT',
    status: 'LOCKED', // Example locked agent for rule validation
    department: 'IT Support',
    avatarColor: '#DC2626',
    activeTicketCount: 0,
  },
  {
    id: 'user-adm-01',
    name: 'Sarah Lee',
    email: 'sarah.lee@opsflow.internal',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    department: 'IT Operations',
    avatarColor: '#0F172A',
  },
];
