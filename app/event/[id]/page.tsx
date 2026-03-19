"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const eventInfo = {
    name: id,
    date: "19 March 2026",
    timing: "2:00 PM - 6:00 PM",
    stage: "League Stage",
    liveOn: "YouTube - iQOO Gaming",
  };

  const ongoingMatches = [
    {
      match: "M3",
      map: "Kalahari",
      placement: "8",
      kill: "12",
      total: "20",
    },
  ];

  const upcomingMatches = [
    {
      match: "M4",
      map: "Alpine",
      placement: "-",
      kill: "-",
      total: "-",
    },
    {
      match: "M5",
      map: "Nexterra",
      placement: "-",
      kill: "-",
      total: "-",
    },
    {
      match: "M6",
      map: "Bermuda",
      placement: "-",
      kill: "-",
      total: "-",
    },
  ];

  const completedMatches = [
    {
      match: "M1",
      map: "Bermuda",
      placement: "10",
      kill: "6",
      total: "16",
    },
    {
      match: "M2",
      map: "Purgatory",
      placement: "7",
      kill: "9",
      total: "16",
    },
  ];

  const renderMatchCard = (
    item: {
      match: string;
      map: string;
      placement: string;
      kill: string;
      total: string;
    },
    index: number,
    type: "ongoing" | "upcoming" | "completed"
  ) => {
    const styles = {
      ongoing: "bg-red-500/20 border border-red-400/30",
      upcoming: "bg-white/10 border border-white/10",
      completed: "bg-green-500/20 border border-green-400/30",
    };

    return (
      <div
        key={index}
        className={`mb-4 rounded-2xl p-4 ${styles[type]}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold text-white">{item.match}</p>
          <p className="text-sm font-semibold text-white/80">{item.map}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/60">Placement Point</p>
            <p className="mt-1 text-lg font-bold text-white">{item.placement}</p>
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
        {/* Top */}
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

        {/* Info Box */}
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

        {/* Ongoing */}
        <h2 className="mb-3 font-bold text-red-400">ONGOING</h2>
        {ongoingMatches.length > 0 ? (
          ongoingMatches.map((item, index) =>
            renderMatchCard(item, index, "ongoing")
          )
        ) : (
          <p className="mb-4 text-sm text-white/60">No ongoing matches</p>
        )}

        {/* Upcoming */}
        <h2 className="mb-3 mt-6 font-bold text-yellow-400">UPCOMING</h2>
        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((item, index) =>
            renderMatchCard(item, index, "upcoming")
          )
        ) : (
          <p className="mb-4 text-sm text-white/60">No upcoming matches</p>
        )}

        {/* Completed */}
        <h2 className="mb-3 mt-6 font-bold text-green-400">COMPLETED</h2>
        {completedMatches.length > 0 ? (
          completedMatches.map((item, index) =>
            renderMatchCard(item, index, "completed")
          )
        ) : (
          <p className="mb-4 text-sm text-white/60">No completed matches</p>
        )}
      </div>
    </div>
  );
}