"use client";

import { useState } from "react";
import {
  Syringe,
  Droplet,
  Heart,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  ArrowLeft,
  Filter,
  Search,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { dummyDonor } from "@/data/dummyDonor";

// ── Types ─────────────────────────────────────────────────────────────────────

type DonationStatus = "COMPLETED" | "EXPIRED" | "SCHEDULED";
type DonationType = "Whole Blood" | "Platelets" | "Plasma" | "Double Red Cells";

interface DonationRecord {
  id: string;
  location: string;
  type: DonationType;
  date: string;
  status: DonationStatus;
  liters?: number;
  certificate?: string;
}

// ── Extended dummy data ───────────────────────────────────────────────────────

const DONATIONS: DonationRecord[] = [
  {
    id: "dh_001",
    location: "St. Jude Medical Center",
    type: "Whole Blood",
    date: "2024-08-24T10:30:00.000Z",
    status: "COMPLETED",
    liters: 0.45,
  },
  {
    id: "dh_002",
    location: "Community Blood Drive",
    type: "Platelets",
    date: "2024-05-12T09:00:00.000Z",
    status: "COMPLETED",
    liters: 0.2,
  },
  {
    id: "dh_003",
    location: "City Emergency Unit",
    type: "Whole Blood",
    date: "2024-01-05T14:00:00.000Z",
    status: "EXPIRED",
    liters: 0,
  },
  {
    id: "dh_004",
    location: "Dhaka Medical College Hospital",
    type: "Plasma",
    date: "2023-10-18T11:00:00.000Z",
    status: "COMPLETED",
    liters: 0.6,
  },
  {
    id: "dh_005",
    location: "Square Hospital",
    type: "Double Red Cells",
    date: "2023-07-04T08:30:00.000Z",
    status: "COMPLETED",
    liters: 0.9,
  },
  {
    id: "dh_006",
    location: "BIRDEM Hospital",
    type: "Whole Blood",
    date: "2023-03-15T10:00:00.000Z",
    status: "COMPLETED",
    liters: 0.45,
  },
  {
    id: "dh_007",
    location: "Popular Medical Centre",
    type: "Platelets",
    date: "2022-11-20T09:30:00.000Z",
    status: "COMPLETED",
    liters: 0.2,
  },
  {
    id: "dh_008",
    location: "National Heart Foundation",
    type: "Plasma",
    date: "2022-08-08T11:00:00.000Z",
    status: "COMPLETED",
    liters: 0.6,
  },
  {
    id: "dh_009",
    location: "Upcoming — Dhaka Medical",
    type: "Whole Blood",
    date: "2024-10-20T09:00:00.000Z",
    status: "SCHEDULED",
    liters: 0,
  },
];

// ── Config ────────────────────────────────────────────────────────────────────

const statusConfig: Record<
  DonationStatus,
  {
    label: string;
    style: string;
    icon: React.ElementType;
  }
> = {
  COMPLETED: {
    label: "Completed",
    style: "text-emerald-600 bg-emerald-50",
    icon: CheckCircle2,
  },
  EXPIRED: {
    label: "Expired",
    style: "text-gray-400 bg-gray-100",
    icon: XCircle,
  },
  SCHEDULED: {
    label: "Scheduled",
    style: "text-blue-600 bg-blue-50",
    icon: Clock,
  },
};

const typeConfig: Record<
  DonationType,
  { color: string; bg: string; liters: number }
> = {
  "Whole Blood": { color: "text-rose-600", bg: "bg-rose-50", liters: 0.45 },
  Platelets: { color: "text-amber-600", bg: "bg-amber-50", liters: 0.2 },
  Plasma: { color: "text-blue-600", bg: "bg-blue-50", liters: 0.6 },
  "Double Red Cells": {
    color: "text-purple-600",
    bg: "bg-purple-50",
    liters: 0.9,
  },
};

const DONATION_TYPES: DonationType[] = [
  "Whole Blood",
  "Platelets",
  "Plasma",
  "Double Red Cells",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return "Upcoming";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}yr ago`;
}

function getLiters(record: DonationRecord) {
  if (record.status !== "COMPLETED") return 0;
  return record.liters ?? typeConfig[record.type].liters;
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  sub,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
      <div
        className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 leading-none">
          {value}
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
          {label}
        </p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyDonationsPage() {
  const donor = dummyDonor;

  const [search, setSearch] = useState("");
  const [typeFilter, setType] = useState<DonationType | "ALL">("ALL");
  const [statusFilter, setStatus] = useState<DonationStatus | "ALL">("ALL");

  const completed = DONATIONS.filter((d) => d.status === "COMPLETED");
  const scheduled = DONATIONS.filter((d) => d.status === "SCHEDULED");
  const totalLiters = completed.reduce((sum, d) => sum + getLiters(d), 0);
  const nextScheduled = scheduled[0];

  // Type breakdown
  const typeBreakdown = DONATION_TYPES.map((type) => ({
    type,
    count: completed.filter((d) => d.type === type).length,
  })).filter((t) => t.count > 0);

  const filtered = DONATIONS.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.location.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q);
    const matchType = typeFilter === "ALL" || d.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const selectClass =
    "bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all appearance-none cursor-pointer";

  return (
    <main className="container py-10 mx-auto w-full">
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
            My Donations
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Your complete blood donation history
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={Syringe}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
          value={String(completed.length)}
          label="Total Donations"
          sub={`of ${donor.totalDonations} tracked`}
        />
        <StatCard
          icon={Heart}
          iconBg="bg-pink-50"
          iconColor="text-pink-500"
          value={String(donor.livesImpacted)}
          label="Lives Impacted"
        />
        <StatCard
          icon={Droplet}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          value={`${totalLiters.toFixed(1)}L`}
          label="Total Donated"
        />
        <StatCard
          icon={Trophy}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          value={donor.status}
          label="Donor Status"
        />
      </div>

      {/* ── TYPE BREAKDOWN + NEXT SCHEDULED ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Type breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">By Type</h3>
          </div>
          <div className="space-y-2.5">
            {typeBreakdown.map(({ type, count }) => {
              const cfg = typeConfig[type];
              const percent = Math.round((count / completed.length) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      {type}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {count}×
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bg.replace("bg-", "bg-").replace("-50", "-400")}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next scheduled + eligibility */}
        <div className="space-y-3">
          {/* Next eligible */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-900">Next Eligible</h3>
            </div>
            <p className="text-xl font-black text-gray-900">
              {formatDate(donor.nextEligibleAt)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last donated {formatDate(donor.lastDonatedAt!)} · Whole Blood
            </p>
          </div>

          {/* Upcoming scheduled */}
          {nextScheduled && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <p className="text-xs font-bold text-blue-700">
                  Upcoming Donation
                </p>
              </div>
              <p className="text-sm font-bold text-blue-900">
                {nextScheduled.location}
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                {nextScheduled.type} · {formatDate(nextScheduled.date)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location or type…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setType(e.target.value as DonationType | "ALL")}
              className={`${selectClass} pl-7 pr-6`}
            >
              <option value="ALL">All Types</option>
              {DONATION_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <CheckCircle2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatus(e.target.value as DonationStatus | "ALL")
              }
              className={`${selectClass} pl-7 pr-6`}
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── HISTORY TABLE — desktop ───────────────────────────────────── */}
      {filtered.length > 0 ? (
        <>
          <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Donation", "Location", "Type", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((record, i) => {
                  const sCfg = statusConfig[record.status];
                  const tCfg = typeConfig[record.type];
                  const StatusIcon = sCfg.icon;
                  const liters = getLiters(record);

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* # */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl ${tCfg.bg} flex items-center justify-center shrink-0`}
                          >
                            <Syringe className={`w-4 h-4 ${tCfg.color}`} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400">
                              #{String(i + 1).padStart(2, "0")}
                            </p>
                            {liters > 0 && (
                              <p className="text-xs font-bold text-gray-700">
                                {liters}L
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
                          <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                            {record.location}
                          </p>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${tCfg.bg} ${tCfg.color}`}
                        >
                          {record.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${sCfg.style}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {sCfg.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold text-gray-700">
                          {formatDate(record.date)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {timeAgo(record.date)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── HISTORY CARDS — mobile ──────────────────────────────────── */}
          <div className="sm:hidden space-y-3">
            {filtered.map((record, i) => {
              const sCfg = statusConfig[record.status];
              const tCfg = typeConfig[record.type];
              const StatusIcon = sCfg.icon;
              const liters = getLiters(record);

              return (
                <div
                  key={record.id}
                  className={`bg-white border border-gray-100 rounded-2xl p-4 ${
                    record.status === "EXPIRED" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${tCfg.bg} flex items-center justify-center shrink-0`}
                      >
                        <Syringe className={`w-4 h-4 ${tCfg.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-400">
                            #{String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tCfg.bg} ${tCfg.color}`}
                          >
                            {record.type}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          {record.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${sCfg.style}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {sCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      {liters > 0 && (
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-600">
                          <Droplet className="w-3 h-3 text-blue-400" />
                          {liters}L
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        {record.location.split(",")[0]}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-700">
                        {formatDate(record.date)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {timeAgo(record.date)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Syringe className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-500">No donations found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search || typeFilter !== "ALL" || statusFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Your donation history will appear here"}
          </p>
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-right">
          Showing{" "}
          <span className="font-bold text-gray-600">{filtered.length}</span> of{" "}
          <span className="font-bold text-gray-600">{DONATIONS.length}</span>{" "}
          records
        </p>
      )}
    </main>
  );
}
