import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import { getTimeAgo } from "@/lib/timeAgo";
import {
  Calendar,
  Droplets,
  FileText,
  Heart,
  Info,
  MapPin,
  ShieldCheck,
  Stethoscope,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { BloodRequest, Urgency } from "../types";
import { urgencyConfig } from "../data";
import UrgencyBadge from "./UrgencyBadge";
import Link from "next/link";

/* ─── helpers ──────────────────────────────────────── */

function formatDate(raw: string): string {
  const d = new Date(raw);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatComponentType(type: string): string {
  const map: Record<string, string> = {
    whole_blood: "Whole Blood",
    platelets: "Platelets",
    plasma: "Plasma",
    red_cells: "Red Cells",
  };
  return map[type] || type;
}

/* ─── component ────────────────────────────────────── */

export default function RequestCard({
  request,
}: {
  request: BloodRequest;
  onViewDetails?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = urgencyConfig[request.urgencyLevel];

  return (
    <>
      {/* ================= CARD ================= */}
      <article className="group relative bg-white border border-gray-100 rounded-3xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)]">
        {/* Subtle top accent line */}
        <div
          className={`absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            request.urgencyLevel === "emergency"
              ? "bg-linear-to-r from-rose-400 to-rose-500"
              : request.urgencyLevel === "urgent"
                ? "bg-linear-to-r from-amber-400 to-amber-500"
                : "bg-linear-to-r from-emerald-400 to-emerald-500"
          }`}
        />

        {/* TOP ROW — Blood badge + Urgency */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-14 h-14 rounded-2xl ${cfg.blood} flex items-center justify-center shadow-sm`}
          >
            <span className={`text-xl font-extrabold ${cfg.bloodText}`}>
              {request.bloodGroup}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <UrgencyBadge urgency={request.urgencyLevel as Urgency} />
            <span className="text-[11px] text-gray-400 font-medium tracking-wide">
              {request.requestNumber}
            </span>
          </div>
        </div>

        {/* Requester row */}
        <Link
          href={`/donors/${request.requesterId._id}`}
          // onClick={onViewDetails}
          title="Show Requester Info."
          className="mt-2 flex items-center cursor-pointer w-full mb-4 gap-3 p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {request.requesterName}
              </p>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
            <p className="text-gray-500 text-xs truncate">
              {request.relation} • {request.patientName}
            </p>
          </div>
        </Link>

        {/* INFO ROWS */}
        <div className="mt-auto space-y-3">
          {/* Hospital */}
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[13px] font-medium truncate">
              {request.hospital}
            </span>
          </div>

          {/* Units + Component */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <Droplets className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[13px] font-medium">
                {request.unitsRequired}{" "}
                {request.unitsRequired === 1 ? "unit" : "units"} •{" "}
                {formatComponentType(request.componentType)}
              </span>
            </div>
          </div>

          {/* Dates row */}
          <div className="flex items-center justify-between text-[13px] pt-1">
            <span className="text-gray-400">
              {getTimeAgo(request.createdAt)}
            </span>
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(request.requiredBy)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* CTA row */}
          <div className="flex gap-2 pt-1">
            <Link
              href={`/donate/${request._id}`}
              className="inline-block flex-1"
            >
              <Button variant="primary" size="sm" className="w-full">
                Donate Now
              </Button>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="w-11 h-11 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center transition-colors"
            >
              <Info className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </article>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-[slideUp_300ms_ease-out]">
            {/* ── Header ── */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${cfg.blood} flex items-center justify-center`}
                >
                  <span className={`font-bold text-lg ${cfg.bloodText}`}>
                    {request.bloodGroup}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Blood Request
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {request.requestNumber} • Posted{" "}
                    {getTimeAgo(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UrgencyBadge urgency={request.urgencyLevel as Urgency} />
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* ── Body (scrollable) ── */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Patient Section */}
              <section>
                <SectionLabel icon={Heart} label="Patient Information" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <InfoItem label="Patient Name" value={request.patientName} />
                  <InfoItem
                    label="Age / Gender"
                    value={`${request.patientAge} yrs / ${
                      request.patientGender.charAt(0).toUpperCase() +
                      request.patientGender.slice(1)
                    }`}
                  />
                  <InfoItem
                    label="Condition"
                    value={request.patientCondition}
                    span
                  />
                </div>
              </section>

              {/* Blood Requirement */}
              <section>
                <SectionLabel icon={Droplets} label="Blood Requirement" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <InfoItem label="Blood Group" value={request.bloodGroup} />
                  <InfoItem
                    label="Units Required"
                    value={`${request.unitsRequired} ${
                      request.unitsRequired === 1 ? "unit" : "units"
                    }`}
                  />
                  <InfoItem
                    label="Component"
                    value={formatComponentType(request.componentType)}
                  />
                  <InfoItem
                    label="Required By"
                    value={`${formatDate(request.requiredBy)}${
                      request.requiredByTime
                        ? ` at ${request.requiredByTime}`
                        : ""
                    }`}
                  />
                </div>
              </section>

              {/* Hospital */}
              <section>
                <SectionLabel icon={MapPin} label="Hospital Details" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <InfoItem label="Hospital" value={request.hospital} span />
                  <InfoItem label="Division" value={request.division} />
                  <InfoItem label="District" value={request.district} />
                  {request.ward && (
                    <InfoItem label="Ward" value={request.ward} span />
                  )}
                </div>
              </section>

              {/* Doctor */}
              <section>
                <SectionLabel icon={Stethoscope} label="Doctor Information" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <InfoItem label="Doctor" value={request.doctorName} />
                  {request.doctorContact && (
                    <InfoItem label="Contact" value={request.doctorContact} />
                  )}
                </div>
              </section>

              {/* Requester / Contact */}
              <section>
                <SectionLabel icon={User} label="Contact Information" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <InfoItem label="Requester" value={request.requesterName} />
                  <InfoItem label="Relation" value={request.relation} />
                  <InfoItem label="Phone" value={request.contactPhone} />
                  {request.alternatePhone && (
                    <InfoItem
                      label="Alternate Phone"
                      value={request.alternatePhone}
                    />
                  )}
                  {request.contactEmail && (
                    <InfoItem label="Email" value={request.contactEmail} span />
                  )}
                </div>
              </section>

              {/* Special Instructions / Notes */}
              {(request.specialInstructions || request.notes) && (
                <section>
                  <SectionLabel icon={FileText} label="Notes & Instructions" />
                  <div className="mt-3 space-y-2">
                    {request.specialInstructions && (
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5">
                        <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wider">
                          Special Instructions
                        </p>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {request.specialInstructions}
                        </p>
                      </div>
                    )}
                    {request.notes && (
                      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5">
                        <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">
                          Additional Notes
                        </p>
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {request.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="p-6 pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 h-12 rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/donate/${request._id}`}
                  className="inline-block flex-2"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── sub-components ───────────────────────────────── */

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-gray-900">
      <Icon className="w-4 h-4 text-gray-400" />
      <h3 className="text-sm font-bold tracking-tight">{label}</h3>
    </div>
  );
}

function InfoItem({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 leading-snug">
        {value}
      </p>
    </div>
  );
}
