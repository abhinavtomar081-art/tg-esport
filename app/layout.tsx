import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* 🔥 ANIMATED HEADER FIXED */}
        <header className="header">
          iQOO TOTAL GAMING ESPORTS
        </header>

        {children}

      </body>
    </html>
  );
}