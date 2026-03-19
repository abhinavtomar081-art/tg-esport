import "./globals.css";

export const metadata = {
  title: "TG Esports",
  description: "TG Esports Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}