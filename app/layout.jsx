import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'ExpenseWise — Personal Finance Journal',
  description:
    'A thoughtfully designed personal finance journal for daily expense tracking, budget monitoring, and financial clarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#F5F3EE] text-[#171717] antialiased selection:bg-[#0047FF] selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
