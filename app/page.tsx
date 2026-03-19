"use client";

const boxItems = [
  "TODAY SCHEDULE",
  "LIVE STANDING",
  "PLAYER FINISHES",
  "PAST PERFORMANCE",
  "JERSEY",
  "ABOUT TEAM",
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140505]">
      {/* Red background theme */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-[#2a0808] to-[#110303]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-6 pb-10">
        <h1 className="mb-6 mt-2 text-center text-xl font-extrabold tracking-[0.2em] text-white drop-shadow-lg sm:text-2xl md:text-3xl">
          iQOO TOTAL GAMING ESPORT
        </h1>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {boxItems.map((item, index) => (
            <div
              key={index}
              className="flex h-36 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/10 px-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl md:h-44"
            >
              <span className="text-base font-bold tracking-[0.12em] text-white md:text-lg">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}