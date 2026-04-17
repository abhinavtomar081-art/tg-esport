"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const boxes = [
    { title: "Today Schedule", path: "/schedule" },
    { title: "Live Standing", path: "/standing" },
    { title: "Player Stats", path: "/players" },
    { title: "Past Performance", path: "/past" },
    { title: "Jersey", path: "/jersey" },
    { title: "Journey", path: "/journey" },
    { title: "Memories", path: "/memories" },
    { title: "Achievements", path: "/achievements" },
    { title: "About Team", path: "/about" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
      {boxes.map((box, index) => (
        <div
          key={index}
          onClick={() => router.push(box.path)}
          className="cursor-pointer bg-zinc-900 border border-red-600 rounded-xl p-6 text-center
                     hover:scale-105 hover:shadow-[0_0_25px_#ff1e1e]
                     transition-all duration-300"
        >
          <h2 className="text-lg font-bold text-red-400 tracking-wide">
            {box.title}
          </h2>
        </div>
      ))}
    </div>
  );
}