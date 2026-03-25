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
  liveOn: string;
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

    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });

    return row;
  });
}

function buildDateTime(date: string, time: string) {
  if (!date || !time || date === "-" || time === "-") return null;
  const safeTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${safeTime}`);
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
  const now = new Date();
  return now.toLocaleString("en-IN");
}

export default function TodaySchedulePage() {
  const [rows, setRows] = useState<EventRow[]>([]);
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

      const events = data
        .filter((r) => r.type === "event")
        .map((r) => ({
          type: r.type,
          eventId: r.eventId,
          name: r.name,
          date: r.date,
          startTime: r.startTime,
          endTime: r.endTime,
          stage: r.stage,
          liveOn: r.liveOn,
          channel: r.channel,
          link: r.link,
        }));

      setRows(events);
    }

    load();
  }, []);

  const ongoing = rows.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "ongoing"
  );

  const upcoming = rows.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "upcoming"
  );

  const completed = rows.filter(
    (e) => getStatus(e.date, e.startTime, e.endTime) === "completed"
  );

  const Card = ({ e }: { e: EventRow }) => (
    <div className="rounded-xl bg-white/5 p-4 border border-white/10">
      <h3 className="text-lg font-bold">{e.name}</h3>
      <p className="text-sm">{e.date}</p>
      <p className="text-sm">{formatTime(e.startTime, e.endTime)}</p>
      <p className="text-sm">{e.stage}</p>
      <p className="text-sm">{e.liveOn}</p>
      <p className="text-sm">{e.channel}</p>

      <div className="mt-3 flex gap-3">
        <Link href={`/today-schedule/${e.eventId}`}>
          <button className="bg-white/10 px-3 py-1 rounded">
            Details
          </button>
        </Link>

        <a href={e.link} target="_blank">
          <button className="bg-red-600 px-3 py-1 rounded">
            Live
          </button>
        </a>
      </div>
    </div>
  );

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold">TODAY SCHEDULE</h1>
      <p className="text-sm mb-4">{time}</p>

      <h2 className="mt-4 text-xl text-red-400">ONGOING</h2>
      {ongoing.map((e) => (
        <Card key={e.eventId} e={e} />
      ))}

      <h2 className="mt-4 text-xl text-yellow-400">UPCOMING</h2>
      {upcoming.map((e) => (
        <Card key={e.eventId} e={e} />
      ))}

      <h2 className="mt-4 text-xl text-green-400">COMPLETED</h2>
      {completed.map((e) => (
        <Card key={e.eventId} e={e} />
      ))}
    </div>
  );
}