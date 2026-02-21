import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoPulse - Emergency Response',
  description: 'Real-time emergency incident tracking and alerts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">EcoPulse</h1>
            <div className="flex gap-4">
              <a href="/" className="hover:underline">Map</a>
              <a href="/alerts" className="hover:underline">Alerts</a>
              <a href="/admin" className="hover:underline">Admin</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
