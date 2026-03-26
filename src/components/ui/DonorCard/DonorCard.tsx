"use client";

import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Timer,
  UserCheck,
  Droplet,
} from "lucide-react";
import Link from "next/link";

type Donor = {
  id?: string | number;
  name: string;
  bloodGroup: string;
  city: string;
  lastDonatedAt: string; // ISO date
  totalDonations: number; // ✅ NEW FIELD
};

type Props = {
  donor: Donor;
};

export default function DonorCard({ donor }: Props) {
  // 🔥 Eligibility logic (90 days)
  const lastDonationDate = new Date(donor.lastDonatedAt);
  const today = new Date();

  const diffInDays =
    (today.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24);

  const isAvailable = diffInDays >= 90;

  const progress = Math.min((diffInDays / 90) * 100, 100);

  const nextEligibleDate = new Date(lastDonationDate);
  nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:bg-red-600 transition-colors">
          {donor.bloodGroup}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-slate-800">{donor.name}</h4>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {donor.city}
          </p>
        </div>
      </div>

      {/* 🩸 Donation Count */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-slate-400">Total Donations</span>
        <span className="flex items-center gap-1 text-sm font-bold text-red-600">
          <Droplet className="w-4 h-4" />
          {donor.totalDonations}
        </span>
      </div>

      {/* Status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Eligibility
          </span>

          {isAvailable ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              READY TO DONATE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Timer className="w-3 h-3" />
              COOLING PERIOD
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isAvailable ? "bg-emerald-500" : "bg-amber-400"
            }`}
            style={{ width: `${progress.toFixed(2)}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-400 italic">
          {isAvailable
            ? `Last donated ${Math.floor(diffInDays)} days ago`
            : `Next eligible on ${nextEligibleDate.toLocaleDateString()}`}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={`/donor/${donor.id ?? ""}`}
        className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <UserCheck className="w-4 h-4" />
        Contact Donor
      </Link>
    </div>
  );
}
