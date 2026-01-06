import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Casa Daljul | Luxury Rental',
  description: 'Experience unparalleled luxury at Casa Daljul.',
};

import { Toaster } from '@/components/ui/toaster';

// ... (imports remain)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          playfair.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
