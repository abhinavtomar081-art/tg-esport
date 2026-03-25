"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EventRow = {
  type: string;
  eventId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  stage: string;
  channel: string;
  link: string;
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQieQgkFoOB1sCdCO71OpPhFaQgntR1LUZt8P5lgRi1LAkOpLCN4VpYOIaJNXoI1tNjtnqnt37VCj_/pub?output=csv";

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map((item) => item.replace(/^"|"$/g, "").trim());
}

function parseCSV(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    headers.forEach((h, i) => (row[h] = values[i] || ""));
    return row;
  });
}

function buildDateTime(date: string, time: string) {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00+05:30`);
}

function getStatus(date: string, start: string, end: string) {
  const now = new Date();
  const s = buildDateTime(date, start);
  const e = buildDateTime(date, end);

  if (!s || !e) return "upcoming";
  if (now < s) return "upcoming";
  if (now > e) return "completed";
  return "ongoing";
}

function formatTime(start: string, end: string) {
  return `${start} - ${end}`;
}

function formatNow() {
  return new Date().toLocaleString("en-IN");
}

function YouTubeButton({ link }: { link: string }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-center w-14 h-14 bg-red-600 rounded-2xl hover:bg-red-700 transition">
        {/* BIG YOUTUBE ICON */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
        >
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.4 3.7-6.4 3.7Z" />
        </svg>
      </div>
    </a>
  );
}

function EventCard({ e }: { e: EventRow }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
      <div className="flex justify-between gap-4">

        <div className="flex-1">
          <Link href={`/today-schedule/${e.eventId}`}>
            <h3 className="text-lg font-bold hover:text-red-400 cursor-pointer">
              {e.name}
            </h3>
          </Link>

          <p className="text-sm text-white/70 mt-1">{e.date}</p>
          <p className="text-sm text-white/70">
            {formatTime(e.startTime, e.endTime)}
          </p>
          <p className="text-sm text-white/70">{e.stage}</p>
          <p className="text-sm text-white/70">{e.channel}</p>
        </div>

        <YouTubeButton link={e.link} />
      </div>
    </div>
  );
}

function Section({
  title,
  events,
  empty,
  color,
}: any) {
  return (
    <div className="mt-6">
      <h2 className={`text-xl font-bold ${color}`}>{title}</h2>

      {events.length ? (
        events.map((e: any) => <EventCard key={e.eventId} e={e} />)
      ) : (
        <p className="text-white/60 mt-2">{empty}</p>
      )}
    </div>
  );
}

export default function Page() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [time, setTime] = useState(formatNow());

  useEffect(() => {
    const t = setInterval(() => setTime(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetch(SHEET_CSV_URL);
      const text = await res.text();
      const data = parseCSV(text);

      setEvents(
        data
          .filter((r) => r.type === "event")
          .map((r) => ({
            type: r.type,
            eventId: r.eventId,
            name: r.name,
            date: r.date,
            startTime: r.startTime,
            endTime: r.endTime,
            stage: r.stage,
            channel: r.channel,
            link: r.link,
          }))
      );
    }

    load();
  }, []);

  const ongoing = events.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "ongoing"
  );

  const upcoming = events.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "upcoming"
  );

  const completed = events.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "completed"
  );

  return (
    <div className="min-h-screen p-4 text-white">
      <h1 className="text-2xl font-bold">TODAY SCHEDULE</h1>
      <p className="text-sm">{time}</p>

      <Section
        title="ONGOING"
        color="text-red-400"
        events={ongoing}
        empty="There is no ongoing event"
      />

      <Section
        title="UPCOMING"
        color="text-yellow-400"
        events={upcoming}
        empty="There is no upcoming event"
      />

      <Section
        title="COMPLETED"
        color="text-green-400"
        events={completed}
        empty="There is no completed event"
      />
    </div>
  );
}