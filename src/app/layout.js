'use client';

import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LegalEase - Connect with Expert Lawyers</title>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}