import { Outfit, Geist } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { cn } from "@/lib/utils";
import { ToastProvider } from '@/context/ToastContext';
import { LocaleProvider } from '@/context/LocaleProvider';
import { loadCatalog } from '@/lib/i18n';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/shared/components/providers/query-provider';
import { Metadata } from 'next';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: 'Inventra | Platform Manajemen Inventaris Cerdas untuk UMKM',
  description: 'Kelola inventaris bisnis Anda dengan Inventra — pelacakan stok real-time, prediksi AI, multi-gudang, dan laporan analitik lengkap untuk UMKM Indonesia.',
  other: {
    "dicoding:email": "akiralolololol@gmail.com",
  },
};

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
          <QueryProvider>
            <AuthProvider>
              <ToastProvider>
                <LocaleProvider>
                  {children}
                </LocaleProvider>
              </ToastProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
