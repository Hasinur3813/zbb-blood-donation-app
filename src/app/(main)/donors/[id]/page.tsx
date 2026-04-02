"use client";

import { useMemo } from "react";
import type { ElementType } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Droplet,
  Heart,
  Syringe,
  Clock,
  Trophy,
  User,
  Weight,
  ArrowLeft,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { getDonorById } from "@/lib/donorApi";
import { useAppSelector } from "@/store";
import { Donor } from "@/types/donor";

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
  return years === 0 ? "< 1 year" : `${years} yr${years > 1 ? "s" : ""}`;
}

// Cooldown days per donation type
const COOLDOWN_DAYS: Record<string, number> = {
  "Whole Blood": 56,
  Platelets: 7,
  Plasma: 28,
  "Double Red Cells": 112,
};

// Inline eligibility — calculated directly from dummyDonor.lastDonatedAt
function calcEligibility(
  lastDonatedAt: string | null,
  lastDonationType: string = "Whole Blood",
  isAvailable: boolean = true,
) {
  if (!isAvailable) {
    return {
      canDonate: false,
      status: "UNAVAILABLE",
      daysSince: null,
      daysLeft: null,
      nextDate: null,
      progress: 0,
    };
  }
  if (!lastDonatedAt) {
    return {
      canDonate: true,
      status: "NEVER_DONATED",
      daysSince: null,
      daysLeft: null,
      nextDate: null,
      progress: 100,
    };
  }

  const cooldown = COOLDOWN_DAYS[lastDonationType] ?? 56;
  const lastDate = new Date(lastDonatedAt);
  const today = new Date();
  const daysSince = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = cooldown - daysSince;
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + cooldown);
  const progress = Math.min(100, Math.round((daysSince / cooldown) * 100));

  if (daysLeft <= 0) {
    return {
      canDonate: true,
      status: "ELIGIBLE",
      daysSince,
      daysLeft: 0,
      nextDate: null,
      progress: 100,
    };
  }

  return {
    canDonate: false,
    status: "COOLING",
    daysSince,
    daysLeft,
    nextDate,
    progress,
  };
}

const historyStatusStyle: Record<string, string> = {
  COMPLETED: "text-emerald-600 bg-emerald-50",
  EXPIRED: "text-gray-400 bg-gray-100",
  SCHEDULED: "text-blue-600 bg-blue-50",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: ElementType;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DonorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const donors = useAppSelector((state) => state.donors.donors);
  const cachedDonor = useMemo(
    () => donors.find((d) => d._id === id) ?? null,
    [donors, id],
  );

  const {
    data: remoteDonor,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Donor, Error>({
    queryKey: ["donor", id],
    queryFn: () => getDonorById(id!),
    enabled: Boolean(id && !cachedDonor),
    staleTime: 1000 * 60 * 5,
  });

  const donor: Donor | null =
    (cachedDonor as Donor | null) ?? (remoteDonor as Donor | undefined) ?? null;
  const loading = isLoading && !cachedDonor;
  const error =
    isError && !donor
      ? queryError instanceof Error
        ? queryError.message
        : "Unable to load donor profile."
      : null;

  if (loading) {
    return (
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
        <p className="text-center text-slate-500">Loading donor profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
        <p className="text-center text-rose-500">{error}</p>
      </main>
    );
  }

  if (!donor) {
    return (
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
        <p className="text-center text-slate-500">Donor not found.</p>
      </main>
    );
  }

  const lastDonationType =
    [...donor.donationHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0]?.type ?? "Whole Blood";

  const eligibility = calcEligibility(
    donor.lastDonatedAt,
    lastDonationType,
    donor.isAvailable,
  );

  const recentHistory = donor.donationHistory.slice(0, 4);
  // console.log(recentHistory);

  const whatsappText = encodeURIComponent(
    `Hi ${donor.fullName}, I urgently need ${donor.bloodGroup} blood. Could you please help me?`,
  );
  const whatsappUrl = `https://wa.me/${donor.phone.replace(/\D/g, "")}?text=${whatsappText}`;

  return (
    <main className="py-10 px-4 container mx-auto w-full" data-donor-id={id}>
      {/* Back */}
      <Link
        href="/donors"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Donors
      </Link>

      {/* ── HERO CARD ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-5">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-rose-500 via-rose-400 to-orange-400" />

        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <Image
                src={donor.avatar}
                alt={donor.fullName}
                width={96}
                height={96}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
              />
              {/* Blood group */}
              <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow leading-tight">
                {donor.bloodGroup}
              </span>
              {/* Verified dot */}
              {donor.verified && (
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                  {donor.fullName}
                </h1>
                {donor.verified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Unverified
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  <Trophy className="w-3 h-3" />
                  {donor.status}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                {donor.bloodGroup} Universal Donor
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: MapPin, label: `${donor.city}, ${donor.country}` },
                  { icon: User, label: `${donor.age} yrs · ${donor.gender}` },
                  { icon: Weight, label: `${donor.weight} kg` },
                  {
                    icon: Trophy,
                    label: `Member ${memberYears(donor.memberSince)}`,
                  },
                  {
                    icon: Calendar,
                    label: `Joined ${formatDate(donor.memberSince)}`,
                  },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full"
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          {donor.bio && (
            <p className="mt-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-5">
              {donor.bio}
            </p>
          )}
        </div>
      </div>

      {/* ── ELIGIBILITY BANNER ──────────────────────────────────────── */}
      <div
        className={`rounded-2xl border p-4 mb-5 ${
          eligibility.canDonate
            ? "bg-emerald-50 border-emerald-100"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              eligibility.canDonate ? "bg-emerald-100" : "bg-amber-100"
            }`}
          >
            {eligibility.canDonate ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-bold ${eligibility.canDonate ? "text-emerald-800" : "text-amber-800"}`}
            >
              {eligibility.status === "ELIGIBLE" && "Ready to Donate"}
              {eligibility.status === "NEVER_DONATED" &&
                "First-Time Donor — Ready"}
              {eligibility.status === "COOLING" &&
                `Cooling Period — ${eligibility.daysLeft} days remaining`}
              {eligibility.status === "UNAVAILABLE" && "Currently Unavailable"}
            </p>
            <p
              className={`text-xs mt-0.5 ${eligibility.canDonate ? "text-emerald-600" : "text-amber-600"}`}
            >
              {eligibility.status === "ELIGIBLE" &&
                `Last donated ${eligibility.daysSince} days ago — fully eligible now`}
              {eligibility.status === "NEVER_DONATED" &&
                "This donor has not donated before and is eligible"}
              {eligibility.status === "COOLING" &&
                `Next eligible on ${eligibility.nextDate ? formatDate(eligibility.nextDate.toISOString()) : "—"}`}
              {eligibility.status === "UNAVAILABLE" &&
                "This donor has marked themselves as unavailable"}
            </p>
            {/* Progress bar */}
            <div className="mt-3 w-full bg-white/60 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  eligibility.canDonate ? "bg-emerald-500" : "bg-amber-400"
                }`}
                style={{ width: `${eligibility.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS + CONTACT ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Heart}
            color="text-rose-500"
            value={String(donor.livesImpacted)}
            label="Lives Saved"
          />
          <StatCard
            icon={Droplet}
            color="text-blue-500"
            value={`${donor.totalLitersDoanted}L`}
            label="Donated"
          />
          <StatCard
            icon={Syringe}
            color="text-indigo-500"
            value={String(donor.totalDonations)}
            label="Donations"
          />
        </div>

        {/* Contact card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Contact
            </p>

            {donor.settings?.privacy?.showPhone && (
              <a
                href={`tel:${donor.phone}`}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-rose-600 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                </div>
                {donor.phone}
              </a>
            )}

            {donor.settings?.privacy?.showEmail && (
              <a
                href={`mailto:${donor.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-rose-600 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                </div>
                {donor.email}
              </a>
            )}

            {!donor.settings?.privacy?.showPhone &&
              !donor.settings?.privacy?.showEmail && (
                <p className="text-xs text-gray-400 italic">
                  This donor has kept their contact info private.
                </p>
              )}
          </div>

          {/* WhatsApp CTA */}
          {donor.settings?.privacy?.allowDirectContact &&
            eligibility.canDonate && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white text-sm font-bold py-3 rounded-2xl transition-all shadow-sm shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                Contact via WhatsApp
              </a>
            )}

          {!eligibility.canDonate && (
            <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 text-sm font-semibold py-3 rounded-2xl cursor-not-allowed">
              <MessageCircle className="w-4 h-4" />
              Currently Unavailable
            </div>
          )}
        </div>
      </div>

      {/* ── DONATION HISTORY ────────────────────────────────────────── */}
      {donor.settings?.privacy?.showDonationHistory && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Donation History
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {donor.totalDonations} total donations
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recentHistory.map((record) => (
              <div
                key={record._id}
                className={`flex items-start gap-3 ${
                  record.status === "EXPIRED" ? "opacity-50" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Syringe className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {record.location}
                    </p>
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
      )}

      {/* If history is private */}
      {!donor.settings?.privacy?.showDonationHistory && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Syringe className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-400">
            Donation history is private
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This donor has chosen to keep their history private.
          </p>
        </div>
      )}
    </main>
  );
}
