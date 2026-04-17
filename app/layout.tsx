import "./globals.css";

export const metadata = {
  title: "iQOO Total Gaming Esports",
  description: "Cyber Esports Arena",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* 🔥 CRAZY ANIMATED HEADER */}
        <header className="crazy-header">
          iQOO TOTAL GAMING ESPORTS
        </header>

        {children}

      </body>
    </html>
  );
}