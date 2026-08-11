import './globals.css';
import { LanguageProvider } from '../components/LanguageContext';
import { AuthProvider } from '../components/AuthContext';
import { CartProvider } from '../components/CartContext';
import RevealObserver from '../components/RevealObserver';

export const metadata = {
  title: 'AsoOkeLuxe — Woven for Now',
  description: 'A premium marketplace for Aso Oke, rooted in Yoruba heritage.',
  keywords: 'aso oke, yoruba fabric, nigerian clothing, handwoven textile, asooke luxury',
  authors: [{ name: 'AsoOkeLuxe' }],
  openGraph: {
    title: 'AsoOkeLuxe — Woven for Now',
    description: 'A premium marketplace for Aso Oke, rooted in Yoruba heritage.',
    type: 'website',
    locale: 'en_NG',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B140D',
};

// This root layout only holds what EVERY page needs (public site AND admin
// dashboard): fonts, PWA meta tags, and the shared providers. Nav/Footer/Grain/
// Cursor live in app/(site)/layout.js instead, so the admin dashboard doesn't
// inherit the public site's chrome — it gets its own shell (app/admin/layout.js).
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,440;0,9..144,560;0,9..144,650;1,9..144,420;1,9..144,500&family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AsoOkeLuxe" />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <RevealObserver />
              {children}
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}