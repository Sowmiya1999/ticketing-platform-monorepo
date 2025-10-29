'use client';

import { Toaster } from 'react-hot-toast';
import Header from './components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-8xl mx-auto p-4 bg-black">{children}</main>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: 'linear-gradient(to right, #2563eb, #fb923c)',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#2563eb',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}
