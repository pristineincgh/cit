import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import RQueryClientProvider from '@/providers/RQueryClientProvider';

const poppins = Poppins({
  weight: ['100', '200', '500', '600', '400', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CIT',
  description:
    'Customer Issues Tracker allows you to track and manage customer support tickets from initial report to resolution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster />
        <RQueryClientProvider>{children}</RQueryClientProvider>
      </body>
    </html>
  );
}
