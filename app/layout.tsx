import './globals.css';
import I18nProvider from '@/components/I18nProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Synergos - Group Wallet Platform</title>
        <meta name="description" content="Collaborative payment management for communities" />
      </head>
      <body className="min-h-screen bg-gradient-light">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
