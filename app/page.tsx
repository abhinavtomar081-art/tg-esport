"use client";

import Link from "next/link";

const boxItems = [
  { title: "TODAY SCHEDULE", link: "/today-schedule" },
  { title: "LIVE STANDING", link: "/live-standing" },
  { title: "PLAYER FINISHES", link: "/player-finishes" },
  { title: "PAST PERFORMANCE", link: "/past-performance" },
  { title: "JERSEY", link: "/jersey" },
  { title: "ABOUT TEAM", link: "/about-team" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140505]">
      
      {/* 🔴 Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#2a0808] to-[#110303]" />
      </div>

      {/* 🔝 Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-6 pb-10">
        
        {/* Heading */}
        <h1 className="mb-6 mt-2 text-center text-xl font-extrabold tracking-[0.2em] text-white drop-shadow-lg sm:text-2xl md:text-3xl">
          iQOO TOTAL GAMING ESPORT
        </h1>

        {/* Boxes */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          
          {boxItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <div className="flex h-36 w-full cursor-pointer items-center justify-center rounded-3xl border border-white/10 bg-white/10 px-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition active:scale-95 md:h-44">
                
                <span className="text-base font-bold tracking-[0.12em] text-white md:text-lg">
                  {item.title}
                </span>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </div>
  );
}