import type { Metadata } from 'next';
import './globals.css';
import { PrototypeProvider } from '@/prototype/PrototypeProvider';
import { PrototypeToolbar } from '@/components/dev/PrototypeToolbar';
import { ToastContainer } from '@/components/feedback/Toast';
import { ConflictDialog } from '@/components/tickets/ConflictDialog';

export const metadata: Metadata = {
  title: 'OpsFlow – Enterprise IT Service Management',
  description: 'Production-quality internal IT support request and ticketing platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-bg-canvas text-text-primary antialiased">
        <PrototypeProvider>
          {/* Quarantined DEV toolbar - rendered only in prototype mode */}
          <PrototypeToolbar />

          <div className="flex-1 flex overflow-hidden">
            {children}
          </div>

          <ToastContainer />
          <ConflictDialog />
        </PrototypeProvider>
      </body>
    </html>
  );
}
