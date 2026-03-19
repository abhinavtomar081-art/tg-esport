"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type EventItem = {
  type: string;
  name: string;
  channel: string;
  link: string;
  status: string;
  logo: string;
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQieQgkFoOB1sCdCO71OpPhFaQgntR1LUZt8P5lgRi1LAkOpLCN4VpYOIaJNXoI1tNjtnqnt37VCj_/pub?output=csv";

export default function TodaySchedulePage() {
  const [time, setTime] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
        const text = await res.text();

        const lines = text.trim().split("\n");
        const rows = lines.slice(1);

        const parsedData: EventItem[] = rows
          .map((row) => {
            const cols = row.split(",").map((col) =>
              col.replace(/^"|"$/g, "").trim()
            );

            return {
              type: cols[0] || "",
              name: cols[1] || "",
              channel: cols[2] || "",
              link: cols[3] || "",
              status: cols[4] || "",
              logo: cols[5] || "/logo.png",
            };
          })
          .filter((item) => item.type.toLowerCase() === "today");

        setEvents(parsedData);
      } catch (error) {
        console.error("Sheet fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  const ongoing = events.filter(
    (item) => item.status.toLowerCase() === "ongoing"
  );

  const upcoming = events.filter(
    (item) => item.status.toLowerCase() === "upcoming"
  );

  const completed = events.filter(
    (item) => item.status.toLowerCase() === "completed"
  );

  const getSafeLink = (link: string) => {
    const trimmedLink = link.trim();
    return trimmedLink.startsWith("http")
      ? trimmedLink
      : `https://${trimmedLink}`;
  };

  const renderEventCard = (
    item: EventItem,
    index: number,
    section: "ongoing" | "upcoming" | "completed"
  ) => {
    const sectionStyles = {
      ongoing: {
        box: "bg-red-500/20 border border-red-400/30",
        text: "text-red-200",
        button: "bg-red-500 text-white",
        buttonText: "Watch Live",
      },
      upcoming: {
        box: "bg-white/10 border border-white/10",
        text: "text-white/70",
        button: "bg-yellow-500 text-black",
        buttonText: "Watch Live",
      },
      completed: {
        box: "bg-green-500/20 border border-green-400/30",
        text: "text-green-200",
        button: "bg-green-500 text-white",
        buttonText: "Watch Replay",
      },
    };

    const style = sectionStyles[section];

    return (
      <div
        key={`${item.name}-${index}`}
        className={`mb-4 rounded-2xl p-4 ${style.box}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={item.logo || "/logo.png"}
              alt={item.name}
              className="h-8 w-8 rounded-full object-cover"
            />

            <Link href={`/event/${item.name}`}>
              <p className="cursor-pointer font-bold text-white underline">
                {item.name}
              </p>
            </Link>
          </div>

          <a
            href={getSafeLink(item.link)}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${style.button}`}
          >
            {style.buttonText}
          </a>
        </div>

        <p className={`mt-2 text-sm ${style.text}`}>{item.channel}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#140505] px-4 pt-6 pb-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-lg font-bold tracking-widest sm:text-2xl">
            TODAY SCHEDULE
          </h1>

          <p className="mt-1 text-sm text-red-300">{time}</p>

          <Link
            href="/"
            className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm"
          >
            Back
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-white/80">Loading schedule...</p>
        ) : (
          <>
            <h2 className="mb-3 font-bold text-red-400">ONGOING</h2>
            {ongoing.length > 0 ? (
              ongoing.map((item, index) =>
                renderEventCard(item, index, "ongoing")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No ongoing events</p>
            )}

            <h2 className="mb-3 mt-6 font-bold text-yellow-400">UPCOMING</h2>
            {upcoming.length > 0 ? (
              upcoming.map((item, index) =>
                renderEventCard(item, index, "upcoming")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No upcoming events</p>
            )}

            <h2 className="mb-3 mt-6 font-bold text-green-400">COMPLETED</h2>
            {completed.length > 0 ? (
              completed.map((item, index) =>
                renderEventCard(item, index, "completed")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No completed events</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}