import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/providers/auth-provider';
import Link from 'next/link';
import { ThemeStyleInjector } from '@/components/providers/theme-style-injector';
import { TweakThemeProvider } from '@/components/providers/tweak-theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'WorkWise',
  description: 'Log your work, streamline your reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TweakThemeProvider>
            <ThemeStyleInjector />
            <AuthProvider>
                <div className="flex-grow">
                  {children}
                </div>
                <Toaster />
            </AuthProvider>
          </TweakThemeProvider>
        </ThemeProvider>
        <footer className="py-4 px-4 text-center text-sm text-muted-foreground">
          <Link href="https://github.com/aravind-sagar" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Made by Aravind Sagar
          </Link>
        </footer>
      </body>
    </html>
  );
}
