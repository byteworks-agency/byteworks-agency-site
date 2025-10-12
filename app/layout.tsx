import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import Navbar from './(components)/Navbar';
import Footer from './(components)/Footer';
import { Manrope, Inter } from 'next/font/google';

const heading = Manrope({ subsets: ['latin'], variable: '--font-heading' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'ByteWorks — Plans & Websites',
  description: 'Modern, minimal, bilingual website plans by ByteWorks.',
  openGraph: {
    title: 'ByteWorks — Plans & Websites',
    description: 'Modern, minimal, bilingual website plans by ByteWorks.',
    images: ['/og.png'],
    url: '/',
    siteName: 'ByteWorks',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByteWorks — Plans & Websites',
    description: 'Modern, minimal, bilingual website plans by ByteWorks.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <Navbar />
            <main className="container py-10">{children}</main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}