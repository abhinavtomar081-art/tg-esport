import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "iQOO Total Gang Esports",
  description: "Aggressive Esports Gaming Team Website",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        {/* 🔥 HEADER */}
        <header className="text-center py-6 border-b border-red-600">
          <h1 className="text-3xl font-extrabold tracking-widest text-red-500 animate-pulse">
            iQOO TOTAL GANG ESPORTS
          </h1>
        </header>

        {/* 📢 LIVE ANNOUNCEMENT BAR */}
        <section className="mx-4 my-4 p-4 border border-red-600 rounded-lg bg-zinc-900">
          <div className="text-red-400 font-bold mb-2">
            🔴 LIVE ANNOUNCEMENTS
          </div>
          <div className="text-sm text-gray-300 animate-pulse">
            No announcements yet... (dynamic data will come here)
          </div>
        </section>

        {/* 🧱 MAIN CONTENT (9 BOXES PAGE WILL GO HERE) */}
        <main className="min-h-screen px-4">
          {children}
        </main>

        {/* 📝 VISION SECTION */}
        <footer className="mt-10 border-t border-red-600 px-4 py-6 text-gray-300 text-sm leading-relaxed">

          <p>
            iQOO Total Gang Esports ek aggressive competitive gaming team hai jo
            esports world mein apni pehchaan banane ke liye bani hai.
            Humara focus sirf khelna nahi, jeetna hai aur har tournament mein
            dominance dikhana hai.
          </p>

          <p className="mt-2">
            Yeh platform humari journey, players, achievements aur live updates ko
            ek jagah laata hai.
            Har match ek nayi opportunity hai apni skill prove karne ki.
          </p>

          <p className="mt-2">
            Team ka vision hai ki hum ek top-tier esports organization ban sake
            jiska naam global level tak pahunch sake.
          </p>

        </footer>

      </body>
    </html>
  );
}