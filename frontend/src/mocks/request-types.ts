export type RequestTypeStatus = 'ACTIVE' | 'INACTIVE';

export interface RequestType {
  id: string;
  name: string;
  code: string;
  description: string;
  status: RequestTypeStatus;
}

export const MOCK_REQUEST_TYPES: RequestType[] = [
  {
    id: 'req-01',
    name: 'Hardware & Workstation',
    code: 'HARDWARE',
    description: 'Issues with laptops, monitors, keyboards, mice, or physical docking stations.',
    status: 'ACTIVE',
  },
  {
    id: 'req-02',
    name: 'Software & Applications',
    code: 'SOFTWARE',
    description: 'OS crashes, licensed software installation, IDE problems, or configuration errors.',
    status: 'ACTIVE',
  },
  {
    id: 'req-03',
    name: 'Network & VPN Access',
    code: 'NETWORK',
    description: 'Wi-Fi connectivity, office LAN drops, or remote VPN authentication failures.',
    status: 'ACTIVE',
  },
  {
    id: 'req-04',
    name: 'Account & Permission',
    code: 'ACCOUNT',
    description: 'Email password resets, GitHub access, LDAP login issues, or role privilege requests.',
    status: 'ACTIVE',
  },
  {
    id: 'req-05',
    name: 'Security Incident',
    code: 'SECURITY',
    description: 'Suspected phishing, malware alerts, lost company devices, or credential exposure.',
    status: 'ACTIVE',
  },
  {
    id: 'req-06',
    name: 'Legacy Dot Matrix Printer Support',
    code: 'LEGACY_PRINTER',
    description: 'Deprecated hardware protocol for old warehouse inventory printers.',
    status: 'INACTIVE', // Example inactive request type
  },
];
