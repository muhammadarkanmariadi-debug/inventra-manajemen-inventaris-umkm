import { Outfit, Geist } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { cn } from "@/lib/utils";
import { ToastProvider } from '@/components/providers/ToastProvider';
import { LocaleProvider } from '@/context/LocaleProvider';
import { loadCatalog } from '@/lib/i18n';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await loadCatalog("id")
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.className} dark:bg-gray-900`}>

        <ThemeProvider>
          <ToastProvider />
          <AuthProvider>
            <LocaleProvider >
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </LocaleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
