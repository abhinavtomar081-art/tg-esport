"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060816]">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#081120] via-[#0b1330] to-[#14081f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      {/* Logo intro */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#060816]"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
              animate={{
                scale: [0.2, 1.15, 1],
                opacity: [0, 1, 1],
                rotate: [-8, 0, 0],
              }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.4, 1.8] }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="absolute h-52 w-52 rounded-full bg-cyan-400/30 blur-2xl"
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={180}
                  height={180}
                  priority
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-6 pb-10">
        <h1 className="mb-6 mt-2 text-center text-xl font-extrabold tracking-[0.2em] text-white drop-shadow-lg sm:text-2xl md:text-3xl">
          iQOO TOTAL GAMING ESPORT
        </h1>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied 🔥");
          }}
          className="absolute right-4 top-4 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
        >
          Copy Link
        </button>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {boxItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group flex h-36 w-full items-center justify-center rounded-3xl border border-white/15 bg-white/10 px-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl md:h-44"
            >
              <span className="text-base font-bold tracking-[0.12em] text-white transition group-hover:text-cyan-200 md:text-lg">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}