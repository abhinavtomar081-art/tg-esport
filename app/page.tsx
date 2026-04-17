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

      {/* 📢 ANNOUNCEMENT */}
      <div className="announcement">
        <div className="announcement-title">
          LIVE ANNOUNCEMENTS
        </div>
        <div className="announcement-text"></div>
      </div>

      {/* 🧱 GRID */}
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

      <div style={{ height: "60px" }} />

    </div>
  );
}