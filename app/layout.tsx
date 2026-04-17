import "./globals.css";

export const metadata = {
  title: "iQOO Total Gaming Esports",
  description: "Esports Gaming Team Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* 🔥 HEADER */}
        <header className="header">
          iQOO TOTAL GAMING ESPORTS
        </header>

        {children}

      </body>
    </html>
  );
}