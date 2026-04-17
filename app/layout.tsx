import "./globals.css";

export const metadata = {
  title: "iQOO Total Gang Esports",
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
          iQOO TOTAL GANG ESPORTS
        </header>

        {children}

      </body>
    </html>
  );
}