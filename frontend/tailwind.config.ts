import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/prototype/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: '#F9FAFB',
          surface: '#FFFFFF',
          subtle: '#F3F6F9',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E2E6EB',
          strong: '#CCD1D9',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1F55D5',
          focus: '#94C2FF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1F55D5',
          700: '#1D4ED8',
        },
        // Semantic ticket states
        ticket: {
          new: { bg: '#E8F5FF', fg: '#175EAD', border: '#BAE6FD' },
          inProgress: { bg: '#E8EEFF', fg: '#294FBA', border: '#C7D2FE' },
          waiting: { bg: '#FFF5E0', fg: '#995703', border: '#FED7AA' },
          resolved: { bg: '#E6F7EB', fg: '#146E38', border: '#BBF7D0' },
          closed: { bg: '#F0F2F4', fg: '#4A5363', border: '#E2E8F0' },
          cancelled: { bg: '#FFEAEA', fg: '#B02A2B', border: '#FECACA' },
        },
        // Priority levels
        priority: {
          p1: { bg: '#FFEAEA', fg: '#B02A2B', border: '#FECACA' },
          p2: { bg: '#FFF5E0', fg: '#995703', border: '#FED7AA' },
          p3: { bg: '#E8EEFF', fg: '#294FBA', border: '#C7D2FE' },
          p4: { bg: '#F0F2F4', fg: '#4A5363', border: '#E2E8F0' },
        },
        // SLA indicators
        sla: {
          normal: { bg: '#E6F7EB', fg: '#146E38', border: '#BBF7D0' },
          dueSoon: { bg: '#FFF5E0', fg: '#995703', border: '#FED7AA' },
          overdue: { bg: '#FFEAEA', fg: '#B02A2B', border: '#FECACA' },
        },
        // Semantic status feedback
        status: {
          success: { bg: '#E6F7EB', fg: '#146E38', border: '#BBF7D0' },
          warning: { bg: '#FFF5E0', fg: '#995703', border: '#FED7AA' },
          danger: { bg: '#FFEAEA', fg: '#B02A2B', border: '#FECACA' },
          info: { bg: '#E8F5FF', fg: '#175EAD', border: '#BAE6FD' },
        },
        // Internal Note dedicated token
        internalNote: {
          bg: '#FFFDF5',
          border: '#FDE68A',
          fg: '#92400E',
          badgeBg: '#FEF3C7',
          badgeFg: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'page-title': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-1': ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        'heading-2': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-3': ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'label': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'popover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
