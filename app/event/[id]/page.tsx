"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type EventRow = {
  type: string;
  name: string;
  channel: string;
  link: string;
  status: string;
  logo: string;
  eventId: string;
  date: string;
  timing: string;
  stage: string;
  liveOn: string;
  match: string;
  section: string;
  map: string;
  placement: string;
  kill: string;
  total: string;
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQieQgkFoOB1sCdCO71OpPhFaQgntR1LUZt8P5lgRi1LAkOpLCN4VpYOIaJNXoI1tNjtnqnt37VCj_/pub?output=csv";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
        const text = await res.text();

        const lines = text.trim().split("\n");
        const dataRows = lines.slice(1);

        const parsedRows: EventRow[] = dataRows.map((row) => {
          const cols = row
            .split(",")
            .map((col) => col.replace(/^"|"$/g, "").trim());

          return {
            type: cols[0] || "",
            name: cols[1] || "",
            channel: cols[2] || "",
            link: cols[3] || "",
            status: cols[4] || "",
            logo: cols[5] || "",
            eventId: cols[6] || "",
            date: cols[7] || "",
            timing: cols[8] || "",
            stage: cols[9] || "",
            liveOn: cols[10] || "",
            match: cols[11] || "",
            section: cols[12] || "",
            map: cols[13] || "",
            placement: cols[14] || "",
            kill: cols[15] || "",
            total: cols[16] || "",
          };
        });

        const filtered = parsedRows.filter(
          (item) =>
            item.type.toLowerCase() === "event" &&
            item.eventId.toLowerCase() === id.toLowerCase()
        );

        setRows(filtered);
      } catch (error) {
        console.error("Event details fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [id]);

  const ongoingMatches = rows.filter(
    (item) => item.section.toLowerCase() === "ongoing"
  );

  const upcomingMatches = rows.filter(
    (item) => item.section.toLowerCase() === "upcoming"
  );

  const completedMatches = rows.filter(
    (item) => item.section.toLowerCase() === "completed"
  );

  const eventInfo = rows[0]
    ? {
        name: rows[0].eventId,
        date: rows[0].date,
        timing: rows[0].timing,
        stage: rows[0].stage,
        liveOn: rows[0].liveOn,
      }
    : {
        name: id,
        date: "-",
        timing: "-",
        stage: "-",
        liveOn: "-",
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
      <div key={index} className={`mb-4 rounded-2xl p-4 ${styles[type]}`}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold text-white">{item.match}</p>
          <p className="text-sm font-semibold text-white/80">{item.map}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Placement Point</p>
            <p className="mt-1 text-lg font-bold text-white">
              {item.placement}
            </p>
          </div>

          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Kill Point</p>
            <p className="mt-1 text-lg font-bold text-white">{item.kill}</p>
          </div>

          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Total Points</p>
            <p className="mt-1 text-lg font-bold text-white">{item.total}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#140505] px-4 pt-6 pb-10 text-white">
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
                {eventInfo.name}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Event Name</p>
                  <p className="mt-1 font-bold text-white">{eventInfo.name}</p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Date</p>
                  <p className="mt-1 font-bold text-white">{eventInfo.date}</p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Timing</p>
                  <p className="mt-1 font-bold text-white">{eventInfo.timing}</p>
                </div>

                <div className="rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/60">Stage</p>
                  <p className="mt-1 font-bold text-white">{eventInfo.stage}</p>
                </div>

                <div className="rounded-xl bg-black/20 p-3 sm:col-span-2">
                  <p className="text-xs text-white/60">Live On</p>
                  <p className="mt-1 font-bold text-white">{eventInfo.liveOn}</p>
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