import { Role } from './users';

export type CommentType = 'PUBLIC' | 'INTERNAL';

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  type: CommentType;
  content: string;
  createdAt: string;
}

export const MOCK_COMMENTS: Comment[] = [
  // Comments for IT-2026-00124 (IN_PROGRESS)
  {
    id: 'cmt-101',
    ticketId: 't-00124',
    authorId: 'user-agt-01',
    authorName: 'Maya Chen',
    authorRole: 'SUPPORT_AGENT',
    type: 'INTERNAL',
    content: 'Checked the core switch logs in building B. Ports 24 and 25 showed flapping around 08:30 AM. Contacting the network ops vendor for line testing.',
    createdAt: '2026-09-24T08:35:00+07:00',
  },
  {
    id: 'cmt-102',
    ticketId: 't-00124',
    authorId: 'user-agt-01',
    authorName: 'Maya Chen',
    authorRole: 'SUPPORT_AGENT',
    type: 'PUBLIC',
    content: 'Hello Alex, I have started diagnosing the switch port connectivity. Could you please confirm if all workstations on the 3rd floor are disconnected or only the east wing?',
    createdAt: '2026-09-24T08:40:00+07:00',
  },
  {
    id: 'cmt-103',
    ticketId: 't-00124',
    authorId: 'user-emp-01',
    authorName: 'Alex Nguyen',
    authorRole: 'EMPLOYEE',
    type: 'PUBLIC',
    content: 'Hi Maya, it seems only the east wing (desks 301 to 325) is affected. The meeting rooms on the west wing still have working Ethernet ports.',
    createdAt: '2026-09-24T08:45:00+07:00',
  },

  // Comments for IT-2026-00125 (WAITING_FOR_EMPLOYEE)
  {
    id: 'cmt-201',
    ticketId: 't-00125',
    authorId: 'user-agt-02',
    authorName: 'Daniel Tran',
    authorRole: 'SUPPORT_AGENT',
    type: 'INTERNAL',
    content: 'The user requested JetBrains IntelliJ Ultimate license. I need to verify their department budget code with Sarah Lee before provisioning.',
    createdAt: '2026-09-23T14:10:00+07:00',
  },
  {
    id: 'cmt-202',
    ticketId: 't-00125',
    authorId: 'user-agt-02',
    authorName: 'Daniel Tran',
    authorRole: 'SUPPORT_AGENT',
    type: 'PUBLIC',
    content: 'Hi Lan, to proceed with the IDE license assignment, please provide your project code or department manager approval email thread.',
    createdAt: '2026-09-23T14:20:00+07:00',
  },

  // Comments for IT-2026-00126 (RESOLVED)
  {
    id: 'cmt-301',
    ticketId: 't-00126',
    authorId: 'user-agt-01',
    authorName: 'Maya Chen',
    authorRole: 'SUPPORT_AGENT',
    type: 'INTERNAL',
    content: 'Replaced the swollen battery with spare part OEM-BAT-5491. Thermal test passed without throttling.',
    createdAt: '2026-09-22T11:00:00+07:00',
  },
  {
    id: 'cmt-302',
    ticketId: 't-00126',
    authorId: 'user-agt-01',
    authorName: 'Maya Chen',
    authorRole: 'SUPPORT_AGENT',
    type: 'PUBLIC',
    content: 'Solution: The laptop battery was replaced with a new OEM battery and internal fan cleaned. The device has been tested for 2 hours under load. You may collect your laptop from the IT Helpdesk counter.',
    createdAt: '2026-09-22T15:30:00+07:00',
  },

  // Comments for IT-2026-00127 (CLOSED)
  {
    id: 'cmt-401',
    ticketId: 't-00127',
    authorId: 'user-agt-03',
    authorName: 'Minh Le',
    authorRole: 'SUPPORT_AGENT',
    type: 'PUBLIC',
    content: 'Solution: Reset multi-factor authentication tokens in Microsoft Entra admin center and issued a temporary bypass code valid for 1 hour.',
    createdAt: '2026-09-20T10:15:00+07:00',
  },
  {
    id: 'cmt-402',
    ticketId: 't-00127',
    authorId: 'user-emp-01',
    authorName: 'Alex Nguyen',
    authorRole: 'EMPLOYEE',
    type: 'PUBLIC',
    content: 'Thank you! I was able to re-enroll my phone Authenticator app successfully. Closing the ticket.',
    createdAt: '2026-09-20T10:45:00+07:00',
  },
];
