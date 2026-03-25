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
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function buildDateTime(date: string, time: string) {
  if (!date || !time || date === "-" || time === "-") return null;

  const safeTime = time.length === 5 ? `${time}:00` : time;
  const parsed = new Date(`${date}T${safeTime}+05:30`);

  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function getStatus(date: string, startTime: string, endTime: string) {
  const now = new Date();
  const start = buildDateTime(date, startTime);
  const end = buildDateTime(date, endTime);

  if (!start || !end) return "upcoming";
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
}

function formatTimeRange(startTime: string, endTime: string) {
  if (!startTime && !endTime) return "-";
  if (!endTime || endTime === "-") return startTime || "-";
  return `${startTime} - ${endTime}`;
}

function formatCurrentDateTime() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function sortByStartTime(items: EventRow[]) {
  return [...items].sort((a, b) => {
    const aDate = buildDateTime(a.date, a.startTime);
    const bDate = buildDateTime(b.date, b.startTime);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return aDate.getTime() - bDate.getTime();
  });
}

function YouTubeButton({ link }: { link: string }) {
  if (!link) {
    return (
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.4 3.7-6.4 3.7Z" />
        </svg>
      </div>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg transition hover:scale-105 hover:bg-red-700"
      aria-label="Open YouTube live"
      title="Open Live"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-5 w-5"
      >
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.4 3.7-6.4 3.7Z" />
      </svg>
    </a>
  );
}

function EventCard({ event }: { event: EventRow }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-red-500/30 bg-red-600/20 px-2.5 py-1 text-xs font-bold tracking-wide text-red-200">
              {event.eventId || "-"}
            </span>

            <Link
              href={`/today-schedule/${event.eventId}`}
              className="text-lg font-extrabold tracking-wide text-white transition hover:text-red-400"
            >
              {event.name || "-"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-white/50">
                Date
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {event.date || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-white/50">
                Time
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {formatTimeRange(event.startTime, event.endTime)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-white/50">
                Stage
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {event.stage || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-white/50">
                Live On
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {event.liveOn || "-"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-white/50">
                Channel
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {event.channel || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <YouTubeButton link={event.link} />
        </div>
      </div>
    </div>
  );
}

function EventSection({
  title,
  titleColor,
  emptyText,
  events,
}: {
  title: string;
  titleColor: string;
  emptyText: string;
  events: EventRow[];
}) {
  return (
    <section className="mt-8">
      <h2 className={`mb-4 text-xl font-extrabold tracking-wide ${titleColor}`}>
        {title}
      </h2>

      {events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm font-medium text-white/60">
          {emptyText}
        </div>
      )}
    </section>
  );
}

export default function TodaySchedulePage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(formatCurrentDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatCurrentDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
        const text = await res.text();
        const parsedRows = parseCSV(text);

        const eventRows: EventRow[] = parsedRows
          .filter((row) => (row.type || "").trim().toLowerCase() === "event")
          .map((row) => ({
            type: row.type || "",
            eventId: row.eventId || "",
            name: row.name || "",
            date: row.date || "",
            startTime: row.startTime || "",
            endTime: row.endTime || "",
            stage: row.stage || "",
            liveOn: row.liveOn || "",
            channel: row.channel || "",
            link: row.link || "",
          }));

        setRows(sortByStartTime(eventRows));
      } catch (error) {
        console.error("CSV fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const ongoingEvents = useMemo(() => {
    return rows.filter(
      (event) => getStatus(event.date, event.startTime, event.endTime) === "ongoing"
    );
  }, [rows]);

  const upcomingEvents = useMemo(() => {
    return rows.filter(
      (event) => getStatus(event.date, event.startTime, event.endTime) === "upcoming"
    );
  }, [rows]);

  const completedEvents = useMemo(() => {
    return rows.filter(
      (event) => getStatus(event.date, event.startTime, event.endTime) === "completed"
    );
  }, [rows]);

  return (
    <main className="min-h-screen px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-wide text-white">
                TODAY SCHEDULE
              </h1>
              <p className="mt-1 text-sm font-semibold text-red-300">
                iQOO TOTAL GAMING ESPORT
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 px-4 py-2 text-sm font-semibold text-white">
              {currentTime}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-white/70">
            Loading schedule...
          </div>
        ) : (
          <>
            <EventSection
              title="ONGOING"
              titleColor="text-red-400"
              emptyText="There is no ongoing event"
              events={ongoingEvents}
            />

            <EventSection
              title="UPCOMING"
              titleColor="text-yellow-400"
              emptyText="There is no upcoming event"
              events={upcomingEvents}
            />

            <EventSection
              title="COMPLETED"
              titleColor="text-green-400"
              emptyText="There is no completed event"
              events={completedEvents}
            />
          </>
        )}
      </div>
    </main>
  );
}