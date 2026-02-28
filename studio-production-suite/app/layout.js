import { Space_Grotesk, Syne } from 'next/font/google';
import BackgroundRotator from '../components/BackgroundRotator';
import SiteHeader from '../components/SiteHeader';
import './globals.css';

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '700'],
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
});

export const metadata = {
  title: 'xrkr80hd Studio',
  description: 'XRKR80HDLocal hub for bands, tracks, projects, and media.',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${syne.variable} page-standard`}>
        <BackgroundRotator />
        <SiteHeader />
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
