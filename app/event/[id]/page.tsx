"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  match: string;
  map: string;
  placement: string;
  kill: string;
  total: string;
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

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function buildDateTime(date: string, time: string) {
  if (!date || !time || date === "-" || time === "-") return null;

  const safeTime = time.length === 5 ? `${time}:00` : time;
  const full = `${date}T${safeTime}`;
  const parsed = new Date(full);

  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function getTimeStatus(date: string, startTime: string, endTime: string) {
  const now = new Date();
  const start = buildDateTime(date, startTime);
  const end = buildDateTime(date, endTime);

  if (!start || !end) return "upcoming";

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
}

function formatTiming(startTime: string, endTime: string) {
  if (!startTime && !endTime) return "-";
  if (!endTime || endTime === "-") return startTime || "-";
  return `${startTime} - ${endTime}`;
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

export default function EventDetailsPage() {
  const params = useParams();
  const rawId = ((params.eventId ?? params.id ?? "") as string).trim();
  const id = decodeURIComponent(rawId).toLowerCase();

  const [allRows, setAllRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL, {
          cache: "no-store",
        });

        const text = await res.text();
        const parsed = parseCSV(text);

        const formattedRows: EventRow[] = parsed.map((row) => ({
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
          match: row.match || "",
          map: row.map || "",
          placement: row.placement || "",
          kill: row.kill || "",
          total: row.total || "",
        }));

        setAllRows(formattedRows);
      } catch (error) {
        console.error("Event details fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  const eventInfo = useMemo(() => {
    return (
      allRows.find(
        (item) =>
          normalize(item.type) === "event" &&
          normalize(item.eventId) === id
      ) || null
    );
  }, [allRows, id]);

  const matchRows = useMemo(() => {
    const filtered = allRows.filter(
      (item) =>
        normalize(item.type) === "match" &&
        normalize(item.eventId) === id
    );

    return sortByStartTime(filtered);
  }, [allRows, id]);

  const ongoingMatches = useMemo(() => {
    return matchRows.filter(
      (item) => getTimeStatus(item.date, item.startTime, item.endTime) === "ongoing"
    );
  }, [matchRows]);

  const upcomingMatches = useMemo(() => {
    return matchRows.filter(
      (item) => getTimeStatus(item.date, item.startTime, item.endTime) === "upcoming"
    );
  }, [matchRows]);

  const completedMatches = useMemo(() => {
    return matchRows.filter(
      (item) => getTimeStatus(item.date, item.startTime, item.endTime) === "completed"
    );
  }, [matchRows]);

  const finalEventInfo = eventInfo
    ? {
        name: eventInfo.name || rawId || "-",
        date: eventInfo.date || "-",
        timing: formatTiming(eventInfo.startTime, eventInfo.endTime),
        stage: eventInfo.stage || "-",
        liveOn: eventInfo.liveOn || "-",
        channel: eventInfo.channel || "-",
        link: eventInfo.link || "",
      }
    : {
        name: rawId || "-",
        date: "-",
        timing: "-",
        stage: "-",
        liveOn: "-",
        channel: "-",
        link: "",
      };

  const renderMatchCard = (
    item: EventRow,
    index: number,
    type: "ongoing" | "upcoming" | "completed"
  ) => {
    const styles = {
      ongoing: "bg-red-500/20 border border-red-400/30",
      upcoming: "bg-white/10 border border-white/10",
      completed: "bg-green-500/20 border border-green-400/30",
    };

    return (
      <div key={`${item.match}-${index}`} className={`mb-4 rounded-2xl p-4 ${styles[type]}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-white">{item.match || "-"}</p>
            <p className="text-xs text-white/60">
              {formatTiming(item.startTime, item.endTime)}
            </p>
          </div>

          <p className="text-sm font-semibold text-white/80">{item.map || "-"}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Placement Point</p>
            <p className="mt-1 text-lg font-bold text-white">
              {item.placement || "-"}
            </p>
          </div>

          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Kill Point</p>
            <p className="mt-1 text-lg font-bold text-white">
              {item.kill || "-"}
            </p>
          </div>

          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Total Points</p>
            <p className="mt-1 text-lg font-bold text-white">
              {item.total || "-"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#140505] px-4 pb-10 pt-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/today-schedule"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm"
          >
            Back
          </Link>

          <h1 className="text-lg font-bold tracking-widest sm:text-2xl">
            EVENT DETAILS
          </h1>

          <div className="w-[60px]" />
        </div>

        {loading ? (
          <p className="text-center text-white/80">Loading event details...</p>
        ) : (
          <>
            <div className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <h2 className="mb-4 text-center text-2xl font-extrabold text-white">
                {finalEventInfo.name}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Event Name</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.name}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Date</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.date}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Timing</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.timing}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Stage</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.stage}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Live On</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.liveOn}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Channel</p>
                  <p className="mt-1 font-bold text-white">
                    {finalEventInfo.channel}
                  </p>
                </div>

                <div className="rounded-xl bg-black/20 p-3 sm:col-span-2">
                  <p className="text-xs text-white/60">Live Link</p>

                  {finalEventInfo.link ? (
                    <a
                      href={finalEventInfo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Open Live
                    </a>
                  ) : (
                    <p className="mt-1 font-bold text-white">-</p>
                  )}
                </div>
              </div>
            </div>

            <h2 className="mb-3 font-bold text-red-400">ONGOING</h2>
            {ongoingMatches.length > 0 ? (
              ongoingMatches.map((item, index) =>
                renderMatchCard(item, index, "ongoing")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No ongoing matches</p>
            )}

            <h2 className="mb-3 mt-6 font-bold text-yellow-400">UPCOMING</h2>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((item, index) =>
                renderMatchCard(item, index, "upcoming")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No upcoming matches</p>
            )}

            <h2 className="mb-3 mt-6 font-bold text-green-400">COMPLETED</h2>
            {completedMatches.length > 0 ? (
              completedMatches.map((item, index) =>
                renderMatchCard(item, index, "completed")
              )
            ) : (
              <p className="mb-4 text-sm text-white/60">No completed matches</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}