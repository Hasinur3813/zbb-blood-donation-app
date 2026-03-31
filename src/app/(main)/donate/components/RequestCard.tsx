import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import { getTimeAgo } from "@/lib/timeAgo";
import { Info, MapPin, ShieldCheck, UserCircle, X } from "lucide-react";
import { BloodRequest, Urgency } from "../types";
import { urgencyConfig } from "../data";
import UrgencyBadge from "./UrgencyBadge";
import Link from "next/link";

export default function RequestCard({
  request,
  onViewDetails,
}: {
  request: BloodRequest;
  onViewDetails?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = urgencyConfig[request.urgencyLevel];

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

            <UrgencyBadge urgency={request.urgencyLevel as Urgency} />
          </div>

          {/* Requester */}
          <button
            onClick={onViewDetails}
            title="View Details"
            className="mt-4 flex items-center cursor-pointer w-full mb-5 gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-gray-900 text-sm">
                  {request.requesterName}
                </p>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-gray-500 text-xs">
                {request.relation} • {request.patientName}
              </p>
            </div>
          </button>
        </div>

        {/* BOTTOM */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{request.hospital}</span>
            </div>

            <span className="text-sm font-bold text-gray-900">
              {request.unitsRequired}{" "}
              {request.unitsRequired === 1 ? "unit" : "units"}
            </span>
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-500">
              {getTimeAgo(request.createdAt)}
            </span>

            <span className="text-sm font-semibold text-gray-900">
              Required by {new Date(request.requiredBy).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/donate/${request._id}`}
              className="inline-block w-full"
            >
              <Button variant="primary" size="sm" className="w-full">
                Donate Now
              </Button>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="w-11 h-11 rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <Info className="w-4 h-4 text-gray-500" />
            </button>
          </div>
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

              <UrgencyBadge urgency={request.urgencyLevel as Urgency} />
            </div>

            {/* Message */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {request.notes}
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
                <p className="font-semibold">{request.unitsRequired}</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/donate/${request._id}`}
              className="inline-block w-full"
            >
              <Button variant="primary" size="md" className="w-full">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
