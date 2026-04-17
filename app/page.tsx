"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const boxes = [
    "Today Schedule",
    "Live Standing",
    "Player Stats",
    "Past Performance",
    "Jersey",
    "Journey",
    "Memories",
    "Achievements",
    "About Team",
  ];

  return (
    <div className="container">

      {/* 🧱 3x3 GRID ONLY */}
      <div className="grid">
        {boxes.map((item, i) => (
          <div
            key={i}
            className="card"
            onClick={() =>
              router.push("/" + item.toLowerCase().replaceAll(" ", ""))
            }
          >
            {item}
          </div>
        ))}
      </div>

    </div>
  );
}