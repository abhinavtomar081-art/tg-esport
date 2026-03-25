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
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

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
  const parsed = new Date(`${date}T${safeTime}+05:30`);

  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
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
  if (!start && !end) return "-";
  if (!end || end === "-") return start || "-";
  return `${start} - ${end}`;
}

function formatNow() {
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
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
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
      className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.45)] transition duration-300 hover:scale-110 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(239,68,68,0.75)]"
      aria-label="Open YouTube live"
      title="Open Live"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-8 w-8 transition duration-300 group-hover:scale-110"
      >
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.4 3.7-6.4 3.7Z" />
      </svg>
    </a>
  );
}

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-300 shadow-[0_0_18px_rgba(248,113,113,0.35)]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
      </span>
      Live
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">
        {value || "-"}
      </p>
    </div>
  );
}

function EventCard({
  event,
  status,
}: {
  event: EventRow;
  status: "ongoing" | "upcoming" | "completed";
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/8 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-400/30 hover:bg-white/12">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-red-500/30 bg-red-500/15 px-2.5 py-1 text-xs font-bold tracking-wide text-red-200">
              {event.eventId || "-"}
            </span>

            {status === "ongoing" && <LiveBadge />}
          </div>

          <Link
            href={`/today-schedule/${event.eventId}`}
            className="inline-block text-xl font-extrabold tracking-wide text-white transition duration-300 hover:text-red-400 hover:drop-shadow-[0_0_12px_rgba(248,113,113,0.45)]"
          >
            {event.name || "-"}
          </Link>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBox label="Date" value={event.date || "-"} />
            <InfoBox label="Time" value={formatTime(event.startTime, event.endTime)} />
            <InfoBox label="Stage" value={event.stage || "-"} />
            <InfoBox label="Channel" value={event.channel || "-"} />
          </div>
        </div>

        <div className="shrink-0 pt-1">
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
  status,
}: {
  title: string;
  titleColor: string;
  emptyText: string;
  events: EventRow[];
  status: "ongoing" | "upcoming" | "completed";
}) {
  return (
    <section className="mt-8">
      <h2 className={`mb-4 text-xl font-extrabold tracking-[0.2em] ${titleColor}`}>
        {title}
      </h2>

      {events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.eventId} event={event} status={status} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm font-medium text-white/65 backdrop-blur-md">
          {emptyText}
        </div>
      )}
    </section>
  );
}

export default function TodaySchedulePage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(formatNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatNow());
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
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/15 bg-white/8 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-wide text-white">
                TODAY SCHEDULE
              </h1>
              <p className="mt-1 text-sm font-semibold text-red-300">
                iQOO TOTAL GAMING ESPORT
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              {currentTime}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/8 p-6 text-center text-white/70 backdrop-blur-md">
            Loading schedule...
          </div>
        ) : (
          <>
            <EventSection
              title="ONGOING"
              titleColor="text-red-400"
              emptyText="There is no ongoing event"
              events={ongoingEvents}
              status="ongoing"
            />

            <EventSection
              title="UPCOMING"
              titleColor="text-yellow-400"
              emptyText="There is no upcoming event"
              events={upcomingEvents}
              status="upcoming"
            />

            <EventSection
              title="COMPLETED"
              titleColor="text-green-400"
              emptyText="There is no completed event"
              events={completedEvents}
              status="completed"
            />
          </>
        )}
      </div>
    </main>
  );
}