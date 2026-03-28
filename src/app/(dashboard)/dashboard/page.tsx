"use client";

import {
  Pencil,
  Heart,
  Droplet,
  CalendarCheck,
  Syringe,
  Megaphone,
  PlusCircle,
  Bell,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  User,
  Weight,
  Trophy,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { dummyDonor } from "@/data/dummyDonor";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function memberYears(iso: string) {
  const years = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  return years === 0
    ? "Less than a year"
    : `${years} year${years > 1 ? "s" : ""}`;
}

const urgencyStyle: Record<string, string> = {
  URGENT: "text-amber-600 bg-amber-50",
  EMERGENCY: "text-rose-600 bg-rose-50",
  NORMAL: "text-emerald-600 bg-emerald-50",
};

const requestStatusStyle: Record<string, string> = {
  ACTIVE: "text-blue-600 bg-blue-50",
  FULFILLED: "text-emerald-600 bg-emerald-50",
  EXPIRED: "text-gray-400 bg-gray-100",
};

const historyStatusStyle: Record<string, string> = {
  COMPLETED: "text-emerald-600 bg-emerald-50",
  EXPIRED: "text-gray-400 bg-gray-100",
  SCHEDULED: "text-blue-600 bg-blue-50",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const donor = dummyDonor;
  const recentHistory = donor.donationHistory.slice(0, 3);

  const onVerify = () => {
    console.log("verifing...");
  };

  return (
    <main className="py-10 container mx-auto">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="mb-8 pb-8 border-b border-gray-100">
        {/* ── UNVERIFIED WARNING ───────────────────────────────────── */}
        {!donor.verified && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">
                  Your account is not verified
                </p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed max-w-sm">
                  Unverified donors appear lower in search results and cannot
                  respond to emergency requests. Verify your identity to unlock
                  full access.
                </p>
              </div>
            </div>
            <button
              onClick={onVerify}
              className="shrink-0 self-start sm:self-auto inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify Now
            </button>
          </div>
        )}

        {/* ── MOBILE LAYOUT (< sm) ──────────────────────────────────── */}
        <div className="sm:hidden">
          {/* Top bar — edit button */}
          <div className="flex justify-end mb-4">
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Profile card */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={donor.avatar}
                  alt={donor.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow leading-tight">
                  {donor.bloodGroup}
                </span>
                {donor.verified ? (
                  <span className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow">
                    <ShieldCheck className="w-3 h-3 text-rose-500" />
                  </span>
                ) : (
                  <span className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  </span>
                )}
              </div>

              {/* Name block */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <h1 className="text-lg font-extrabold tracking-tight text-gray-900 truncate">
                    {donor.name}
                  </h1>
                  {donor.verified ? (
                    <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {donor.bloodGroup} ·{" "}
                  <span className="text-rose-500 font-semibold">
                    {donor.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Meta grid — 2 col */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: MapPin, label: `${donor.city}, ${donor.country}` },
                { icon: User, label: `${donor.age} yrs · ${donor.gender}` },
                { icon: Weight, label: `${donor.weight} kg` },
                {
                  icon: Trophy,
                  label: `Member ${memberYears(donor.memberSince)}`,
                },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2"
                >
                  <Icon className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-[11px] text-gray-500 truncate">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (>= sm) ────────────────────────────────── */}
        <div className="hidden sm:flex sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={donor.avatar}
                alt={donor.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow leading-tight">
                {donor.bloodGroup}
              </span>
              {donor.verified ? (
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                </span>
              ) : (
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                </span>
              )}
            </div>

            {/* Name + details */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  {donor.name}
                </h1>
                {donor.verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-3">
                {donor.bloodGroup} Donor ·{" "}
                <span className="text-rose-500 font-semibold">
                  {donor.status} Status
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: MapPin, label: `${donor.city}, ${donor.country}` },
                  { icon: User, label: `${donor.age} yrs · ${donor.gender}` },
                  { icon: Weight, label: `${donor.weight} kg` },
                  {
                    icon: Trophy,
                    label: `Member ${memberYears(donor.memberSince)}`,
                  },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="self-start inline-flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors shrink-0">
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </header>
      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          {
            icon: Heart,
            color: "text-rose-500",
            value: String(donor.livesImpacted),
            label: "Lives Impacted",
          },
          {
            icon: Droplet,
            color: "text-blue-500",
            value: `${donor.totalLitersDoanted}L`,
            label: "Total Donated",
          },
          {
            icon: CalendarCheck,
            color: "text-emerald-500",
            value: formatDate(donor.nextEligibleAt).split(",")[0],
            label: "Next Eligible",
          },
        ].map(({ icon: Icon, color, value, label }) => (
          <div
            key={label}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-3"
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <div>
              <p className="text-xl sm:text-3xl font-black text-gray-900 leading-none">
                {value}
              </p>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Left col — Availability + Contact */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Availability */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Availability
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Toggle to appear in donor searches.
              </p>
            </div>
            <div className="flex items-center justify-between bg-white border border-gray-100 px-4 py-3 rounded-xl">
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Ready to Donate
                </p>
                {donor.lastDonatedAt && (
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Last donated {formatDate(donor.lastDonatedAt)}
                  </p>
                )}
              </div>
              <button
                className={`w-12 h-6 rounded-full relative transition-colors ${donor.isAvailable ? "bg-rose-500" : "bg-gray-200"}`}
                aria-label="Toggle availability"
              >
                <div
                  className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all ${donor.isAvailable ? "right-1" : "left-1"}`}
                />
              </button>
            </div>
            {/* Next eligible */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 px-4 py-3 rounded-xl">
              <Clock className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span>
                Next eligible:{" "}
                <span className="font-bold text-gray-700">
                  {formatDate(donor.nextEligibleAt)}
                </span>
              </span>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-gray-900 mb-1">Contact</h3>
            {[
              { icon: Phone, value: donor.phone },
              { icon: Mail, value: donor.email },
            ].map(({ icon: Icon, value }) => (
              <div
                key={value}
                className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-3 rounded-xl"
              >
                <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {donor.bio && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <h3 className="text-base font-bold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {donor.bio}
              </p>
            </div>
          )}
        </div>

        {/* Right col — History + Requests */}
        <div className="md:col-span-8 flex flex-col gap-4">
          {/* Donation History */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex-1">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Donation History
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {donor.totalDonations} total donations
                </p>
              </div>
              <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {recentHistory.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-start gap-3 ${record.status === "EXPIRED" ? "opacity-50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Syringe className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {record.location}
                      </h4>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${historyStatusStyle[record.status]}`}
                      >
                        {record.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {record.type} · {formatDate(record.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Made */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-gray-900">
                Requests Made
              </h3>
              <span className="text-xs text-gray-400">
                {donor.requestsMade.length} total
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {donor.requestsMade.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                        <Megaphone className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span className="text-xs font-black text-rose-600">
                        #{req.requestNo}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${urgencyStyle[req.urgency]}`}
                    >
                      {req.urgency}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">
                    {req.reason}
                  </p>
                  <p className="text-xs text-gray-400 mb-3 truncate">
                    {req.hospital}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${requestStatusStyle[req.status]}`}
                      >
                        {req.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {req.respondedDonors} donors
                      </span>
                    </div>
                    <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                      Manage →
                    </button>
                  </div>
                </div>
              ))}

              {/* New request CTA */}
              <button className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-colors min-h-[120px]">
                <PlusCircle className="w-5 h-5" />
                <span className="text-xs font-semibold">New Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALERT BANNER ───────────────────────────────────────────── */}
      <section className="mt-6 bg-rose-50 border border-rose-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute w-10 h-10 rounded-full bg-rose-400 opacity-20" />
            <div className="relative w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Urgent Need Near You
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-sm">
              Someone needs {donor.bloodGroup} blood urgently. Your contribution
              could save a life.
            </p>
          </div>
        </div>
        <button className="shrink-0 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm">
          Accept Request
        </button>
      </section>
    </main>
  );
}
