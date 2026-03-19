"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ongoing = [
  {
    name: "E3",
    logo: "/logo.png",
    channel: "YouTube - iQOO Gaming",
    link: "https://youtube.com",
  },
];

const upcoming = [
  {
    name: "E4",
    logo: "/logo.png",
    channel: "YouTube - iQOO Gaming",
    link: "https://youtube.com",
  },
  {
    name: "E5",
    logo: "/logo.png",
    channel: "YouTube - iQOO Gaming",
    link: "https://youtube.com",
  },
];

const completed = [
  {
    name: "E1",
    logo: "/logo.png",
    channel: "YouTube - iQOO Gaming",
    link: "https://youtube.com",
  },
  {
    name: "E2",
    logo: "/logo.png",
    channel: "YouTube - iQOO Gaming",
    link: "https://youtube.com",
  },
];

export default function TodaySchedulePage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#140505] px-4 pt-6 pb-10 text-white">
      
      {/* 🔝 Top Bar */}
      <div className="flex flex-col items-center mb-6">
        
        <h1 className="font-bold text-lg sm:text-2xl tracking-widest">
          TODAY SCHEDULE
        </h1>

        {/* ⏰ Live Time */}
        <p className="text-sm text-red-300 mt-1">{time}</p>

        <Link href="/" className="mt-3 bg-white/10 px-4 py-2 rounded-lg text-sm">
          Back
        </Link>
      </div>

      {/* 🔴 ONGOING */}
      <h2 className="text-red-400 font-bold mb-3">ONGOING</h2>

      {ongoing.map((item, i) => (
        <div key={i} className="bg-red-500/20 p-4 rounded-2xl mb-4 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            
            {/* Logo */}
            <img src={item.logo} className="w-8 h-8 rounded-full" />

            {/* Event Name clickable */}
            <Link href={`/event/${item.name}`}>
              <p className="font-bold underline cursor-pointer">{item.name}</p>
            </Link>

          </div>

          <div className="text-right">
            <p className="text-sm text-red-200">{item.channel}</p>

            <a
              href={item.link}
              target="_blank"
              className="inline-block mt-1 bg-red-500 px-3 py-1 rounded text-xs"
            >
              Watch Live
            </a>
          </div>

        </div>
      ))}

      {/* 🟡 UPCOMING */}
      <h2 className="text-yellow-400 font-bold mt-6 mb-3">UPCOMING</h2>

      {upcoming.map((item, i) => (
        <div key={i} className="bg-white/10 p-4 rounded-2xl mb-4 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <img src={item.logo} className="w-8 h-8 rounded-full" />

            <Link href={`/event/${item.name}`}>
              <p className="font-bold underline cursor-pointer">{item.name}</p>
            </Link>
          </div>

          <div className="text-right">
            <p className="text-sm text-white/70">{item.channel}</p>

            <a
              href={item.link}
              target="_blank"
              className="inline-block mt-1 bg-yellow-500 px-3 py-1 rounded text-xs text-black"
            >
              Watch Live
            </a>
          </div>

        </div>
      ))}

      {/* 🟢 COMPLETED */}
      <h2 className="text-green-400 font-bold mt-6 mb-3">COMPLETED</h2>

      {completed.map((item, i) => (
        <div key={i} className="bg-green-500/20 p-4 rounded-2xl mb-4 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <img src={item.logo} className="w-8 h-8 rounded-full" />

            <Link href={`/event/${item.name}`}>
              <p className="font-bold underline cursor-pointer">{item.name}</p>
            </Link>
          </div>

          <div className="text-right">
            <p className="text-sm text-green-200">{item.channel}</p>

            <a
              href={item.link}
              target="_blank"
              className="inline-block mt-1 bg-green-500 px-3 py-1 rounded text-xs"
            >
              Watch Replay
            </a>
          </div>

        </div>
      ))}

    </div>
  );
}