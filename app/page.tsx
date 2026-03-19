"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const boxItems = [
  "TODAY SCHEDULE",
  "LIVE STANDING",
  "PLAYER FINISHES",
  "PAST PERFORMANCE",
  "JERSEY",
  "ABOUT TEAM",
];

export default function Home() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {showLogo && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={220}
            height={220}
            priority
            className="object-contain"
          />
        </motion.div>
      )}

      <div className="flex flex-col items-center pt-6 pb-10 px-4 relative z-10">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-center drop-shadow-lg mb-6">
          iQOO TOTAL GAMING ESPORT
        </h1>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied 🔥");
          }}
          className="absolute top-4 right-4 bg-white text-black px-3 py-2 rounded-lg text-sm font-semibold shadow-md active:scale-95 transition"
        >
          Copy Link
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-6">
          {boxItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full h-36 md:h-44 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center text-center px-4 active:scale-95 transition"
            >
              <span className="text-white text-base md:text-lg font-bold tracking-wide">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}