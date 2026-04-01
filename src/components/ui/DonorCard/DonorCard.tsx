"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Timer,
  UserCheck,
  Droplet,
  Phone,
  MessageCircle,
  X,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Donor } from "@/types/donor";

type FormData = {
  location: string;
  message: string;
};

type Props = {
  donor: Donor;
};

export default function DonorCard({ donor }: Props) {
  const [open, setOpen] = useState(false);

  // 🔥 Fake current user (replace later with auth)
  const currentUser = {
    name: "Hasinur",
    phone: "0173061332",
    city: "Pabna",
  };

  // 🔥 Eligibility logic
  const lastDonationDate = donor.lastDonatedAt
    ? new Date(donor.lastDonatedAt)
    : null;
  const today = new Date();

  const diffInDays = lastDonationDate
    ? (today.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    : 90; // If no last donation, assume eligible

  const isAvailable = donor.isAvailable;
  const progress = Math.min((diffInDays / 90) * 100, 100);

  const nextEligibleDate = new Date(donor.nextEligibleAt);

  // 🔥 React Hook Form
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      location: currentUser.city,
      message: `🩸Blood Request
Hello ${donor.fullName},

I am ${currentUser.name} from zbb.com.
I need ${donor.bloodGroup} blood.

Location: ${currentUser.city}

Please let me know if you can help🙏`,
    },
  });

  const onSubmit = (data: FormData) => {
    const finalMessage = `${data.message}

📍 Location: ${data.location}
📞 Contact: ${currentUser.phone}`;

    const url = `https://wa.me/${donor.phone}?text=${encodeURIComponent(
      finalMessage,
    )}`;

    window.open(url, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${donor.phone}`;
  };

  return (
    <>
      {/* ================= CARD (UNCHANGED UI) ================= */}
      <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
        {/* Subtle top glow on hover */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-rose-500 via-rose-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-4xl" />

        {/* Header — Avatar + Name + Visit Profile */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Avatar with blood group + verified badge */}
            <div className="relative shrink-0">
              {donor.avatar ? (
                <>
                  <Image
                    src={donor.avatar}
                    alt={donor.fullName}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  {/* Blood group — always visible on top-left */}
                  <span className="absolute -top-2 -left-2 bg-slate-900 group-hover:bg-rose-600 transition-colors text-white text-[10px] font-black px-1 py-1 rounded-lg shadow-md leading-tight">
                    {donor.bloodGroup}
                  </span>
                </>
              ) : (
                <div className="w-14 h-14 bg-slate-900 group-hover:bg-rose-600 transition-colors rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {donor.bloodGroup}
                </div>
              )}
              {/* Verified dot */}
              {donor.verified && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-slate-800 leading-tight">
                  {donor.fullName}
                </h4>
                {donor.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {donor.city}
              </p>
            </div>
          </div>

          {/* Visit profile button */}
          <Link
            href={`/donors/${donor._id}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors shrink-0"
            aria-label="View donor profile"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Total donations */}
        <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-2xl mb-4">
          <span className="text-xs font-semibold text-slate-400">
            Total Donations
          </span>
          <span className="flex items-center gap-1 text-sm font-black text-rose-600">
            <Droplet className="w-4 h-4" />
            {donor.totalDonations} times
          </span>
        </div>

        {/* Eligibility */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Eligibility
            </span>
            {isAvailable ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Ready to Donate
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <Timer className="w-3 h-3" />
                Cooling Period
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isAvailable ? "bg-emerald-500" : "bg-amber-400"
              }`}
              style={{ width: `${progress.toFixed()}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 italic">
            {isAvailable
              ? lastDonationDate
                ? `Last donated ${Math.floor(diffInDays)} days ago`
                : "No previous donations"
              : `Next eligible on ${nextEligibleDate.toLocaleDateString()}`}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 cursor-pointer bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold hover:bg-rose-600 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-auto"
        >
          <UserCheck className="w-4 h-4" />
          Contact Donor
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-linear-to-r from-rose-500 via-rose-400 to-orange-400" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <span className="text-lg font-black text-rose-600">
                      {donor.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                      Contact {donor.fullName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Blood Group{" "}
                      <span className="font-bold text-rose-600">
                        {donor.bloodGroup}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer  hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {donor.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCall}
                  className="flex cursor-pointer  items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Now
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  or send on WhatsApp
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      {...register("location")}
                      placeholder="e.g. Dhaka Medical College Hospital"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Describe your need briefly…"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] cursor-pointer  text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
