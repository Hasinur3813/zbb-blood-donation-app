import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { getTimeAgo } from "@/lib/timeAgo";
import { Info, MapPin, ShieldCheck, UserCircle, X } from "lucide-react";
import { BloodRequest } from "../types";
import { urgencyConfig } from "../data";
import UrgencyBadge from "./UrgencyBadge";

export default function RequestCard({ request }: { request: BloodRequest }) {
  const [open, setOpen] = useState(false);
  const cfg = urgencyConfig[request.urgency];

  return (
    <>
      {/* ================= CARD ================= */}
      <article className="group bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* TOP */}
        <div className="mb-5">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 rounded-2xl ${cfg.blood} flex items-center justify-center`}
            >
              <span className={`text-xl font-extrabold ${cfg.bloodText}`}>
                {request.bloodGroup}
              </span>
            </div>

            <UrgencyBadge urgency={request.urgency} />
          </div>

          {/* Requester */}
          <button
            // onClick={onViewProfile}
            title="View Profile"
            className="mt-4 flex items-center cursor-pointer w-full mb-5  gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="relative">
              {request.avatar ? (
                <Image
                  src={request.avatar}
                  alt={request.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {request.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow">
                  <ShieldCheck className="w-3 h-3 text-rose-500" />
                </span>
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium group-hover:text-red-500 text-gray-800 truncate">
                {request.name}
              </p>
              <p className="text-xs text-gray-400">{request.role}</p>
            </div>
          </button>

          <div className="flex items-center gap-1.5 text-gray-400 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm truncate">{request.hospital}</span>
          </div>
        </div>

        {/* META */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <p className="text-[11px] text-gray-400 uppercase">Posted</p>
            <p className="text-sm font-semibold text-gray-800">
              {getTimeAgo(request.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-400 uppercase">Required</p>
            <p className="text-sm font-semibold text-gray-800">
              {request.requiredBy}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-400 uppercase">Units</p>
            <p className="text-sm font-semibold text-gray-800">
              {request.units}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-auto">
          <Button variant="primary" size="md" className="flex-1">
            Donate Now
          </Button>

          <button
            onClick={() => setOpen(true)}
            className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </article>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl flex flex-col gap-6 animate-in fade-in">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute cursor-pointer -top-2 -right-2 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${cfg.blood} flex items-center justify-center`}
                >
                  <span className={`font-bold ${cfg.bloodText}`}>
                    {request.bloodGroup}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Blood Request
                  </h2>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {request.hospital}
                  </div>
                </div>
              </div>

              <UrgencyBadge urgency={request.urgency} />
            </div>

            {/* Message */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {request.message}
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Posted</p>
                <p className="font-semibold">{getTimeAgo(request.createdAt)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Required</p>
                <p className="font-semibold">{request.requiredBy}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Units</p>
                <p className="font-semibold">{request.units}</p>
              </div>
            </div>

            {/* CTA */}
            <Button className="w-full">Donate Now</Button>
          </div>
        </div>
      )}
    </>
  );
}
