"use client";

import { JSX, useState } from "react";
import Image from "next/image";
import {
  Droplet,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Users,
  AlertTriangle,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  UserCircle,
  Heart,
  Calendar,
  Stethoscope,
  BedDouble,
  ClipboardList,
  BadgeCheck,
  Send,
  Loader2,
} from "lucide-react";
import { getTimeAgo } from "@/lib/timeAgo";
import { dummyDonor } from "@/data/dummyDonor";
import type { UrgencyLevel } from "@/types/Request";
import Link from "next/link";

type ResponderStatus = "pending" | "confirmed" | "donated" | "cancelled";

export interface Responder {
  id: string;
  name: string;
  avatar: string | null;
  bloodGroup: string;
  phone?: string;
  location: string;
  respondedAt: string;
  status: ResponderStatus;
  message?: string;
  verified: boolean;
  donationsCount: number;
}

const getBloodCfg = (group: string) => {
  const configs: Record<string, { bg: string; text: string; border: string }> =
    {
      "O+": {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100",
      },
      "O-": {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100",
      },
      "A+": {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-100",
      },
      "A-": {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-100",
      },
      "B+": {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-100",
      },
      "B-": {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-100",
      },
      "AB+": {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
      },
      "AB-": {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
      },
    };
  return (
    configs[group] || {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
    }
  );
};

const getUrgencyCfg = (urgency: string) => {
  const configs: Record<
    string,
    { bg: string; dot: string; text: string; label: string }
  > = {
    Emergency: {
      bg: "bg-rose-50",
      dot: "bg-rose-500",
      text: "text-rose-600",
      label: "Emergency",
    },
    Urgent: {
      bg: "bg-amber-50",
      dot: "bg-amber-500",
      text: "text-amber-600",
      label: "Urgent",
    },
    Normal: {
      bg: "bg-blue-50",
      dot: "bg-blue-500",
      text: "text-blue-600",
      label: "Normal",
    },
    EMERGENCY: {
      bg: "bg-rose-50",
      dot: "bg-rose-500",
      text: "text-rose-600",
      label: "Emergency",
    },
    URGENT: {
      bg: "bg-amber-50",
      dot: "bg-amber-500",
      text: "text-amber-600",
      label: "Urgent",
    },
    NORMAL: {
      bg: "bg-blue-50",
      dot: "bg-blue-500",
      text: "text-blue-600",
      label: "Normal",
    },
  };
  return (
    configs[urgency] || {
      bg: "bg-rose-50",
      dot: "bg-rose-500",
      text: "text-rose-600",
      label: "Urgent",
    }
  );
};

const STATUS_CONFIG: Record<
  ResponderStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-600", label: "Confirmed" },
  donated: { bg: "bg-green-50", text: "text-green-600", label: "Donated" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: "Cancelled" },
};

const MOCK_REQUEST = {
  id: "req_1",
  bloodGroup: "O-", // matching the dummyDonor group for the direct match demo
  urgency: "Emergency" as UrgencyLevel,
  unitsCollected: 1,
  units: 3,
  createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  hospital: "Dhaka Medical College Hospital",
  address: "100 Secretariat Road, Dhaka 1000",
  responders: [] as Responder[],
  requiredBy: new Date(Date.now() + 3600000 * 5).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }),
  patientName: "Rahim Chowdhury",
  patientAge: 45,
  doctorName: "Dr. Ahmed Hasan",
  ward: "ICU - Bed 12",
  patientCondition:
    "Severe blood loss due to road accident. Requires immediate transfusion.",
  notes:
    "Please call the contact number before arriving. Only pure O- blood donors.",
  name: "Karim Uddin",
  avatar: "",
  verified: true,
  role: "Patient's Brother",
  contactPhone: "+880 1711-223344",
  contactEmail: "karim@example.com",
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({
  name,
  avatar,
  size = 9,
}: {
  name: string;
  avatar: string | null;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const sz = `w-${size} h-${size}`;
  return avatar ? (
    <Image
      src={avatar}
      alt={name}
      width={size * 4}
      height={size * 4}
      className={`${sz} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sz} rounded-full bg-rose-100 flex items-center justify-center`}
    >
      <span className="text-xs font-bold text-rose-600">{initials}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ResponderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const icons: Record<ResponderStatus, JSX.Element> = {
    pending: <Clock className="w-3 h-3" />,
    confirmed: <CheckCircle2 className="w-3 h-3" />,
    donated: <Heart className="w-3 h-3 fill-current" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      {icons[status]}
      {cfg.label}
    </span>
  );
}

function ResponderCard({
  responder,
  isOwner,
  onStatusChange,
}: {
  responder: Responder;
  isOwner: boolean;
  onStatusChange?: (id: string, s: ResponderStatus) => void;
}) {
  const cfg = getBloodCfg(responder.bloodGroup);
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-rose-100 hover:shadow-sm transition-all">
      <div className="relative shrink-0">
        <Avatar name={responder.name} avatar={responder.avatar} size={10} />
        {responder.verified && (
          <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-rose-500" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {responder.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {responder.location} · {getTimeAgo(responder.respondedAt)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
            >
              {responder.bloodGroup}
            </span>
            <StatusBadge status={responder.status} />
          </div>
        </div>

        {responder.message && (
          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 italic">
            &quot;{responder.message}&quot;
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            {responder.donationsCount} donations
          </span>
          {responder.phone && (
            <a
              href={`tel:${responder.phone}`}
              className="text-[11px] text-rose-500 hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              {responder.phone}
            </a>
          )}
        </div>

        {/* Owner controls */}
        {isOwner && responder.status === "pending" && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onStatusChange?.(responder.id, "confirmed")}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Confirm
            </button>
            <button
              onClick={() => onStatusChange?.(responder.id, "cancelled")}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}
        {isOwner && responder.status === "confirmed" && (
          <div className="mt-3">
            <button
              onClick={() => onStatusChange?.(responder.id, "donated")}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3 fill-green-500" /> Mark as Donated
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DonationRequestPage() {
  const [request, setRequest] = useState(MOCK_REQUEST);

  // Respond form state
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [responded, setResponded] = useState(false);
  const [myStatus, setMyStatus] = useState<ResponderStatus | null>(null);

  // Simulate logged-in donor
  const ME = {
    id: dummyDonor.id,
    name: dummyDonor.name,
    bloodGroup: dummyDonor.bloodGroup,
    verified: dummyDonor.verified,
    donationsCount: dummyDonor.totalDonations,
  };
  const isOwner = false; // flip to true to test owner controls// donor can also change the status

  const bloodCfg = getBloodCfg(request.bloodGroup);
  const urgCfg = getUrgencyCfg(request.urgency);
  const progress = Math.min(
    (request.unitsCollected / request.units) * 100,
    100,
  );

  const handleRespond = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400)); // simulate API
    const newResponder: Responder = {
      id: "me",
      name: ME.name,
      avatar: null,
      bloodGroup: ME.bloodGroup,
      phone: "+880 1700-000000",
      location: "Your Location, Dhaka",
      respondedAt: new Date().toISOString(),
      status: "pending",
      message,
      verified: ME.verified,
      donationsCount: ME.donationsCount,
    };
    setRequest((r) => ({ ...r, responders: [newResponder, ...r.responders] }));
    setMyStatus("pending");
    setResponded(true);
    setSubmitting(false);
  };

  const handleStatusChange = (id: string, status: ResponderStatus) => {
    setRequest((r) => ({
      ...r,
      responders: r.responders.map((res) =>
        res.id === id ? { ...res, status } : res,
      ),
      unitsCollected:
        status === "donated" ? r.unitsCollected + 1 : r.unitsCollected,
    }));
  };

  const alreadyResponded =
    responded || request.responders.some((r) => r.id === "me");

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page top accent */}
      <div className="h-1 w-full bg-linear-to-r from-rose-400 via-rose-600 to-rose-400" />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link href={"/donate"}>
          <button className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 hover:text-rose-600 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to requests
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Urgency strip */}
              <div
                className={`px-6 py-2.5 flex items-center gap-2 ${urgCfg.bg} border-b border-gray-100`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${urgCfg.dot} animate-pulse`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${urgCfg.text}`}
                >
                  {urgCfg.label} Request
                </span>
                <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {getTimeAgo(request.createdAt)}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Blood group */}
                  <div
                    className={`shrink-0 w-16 h-16 rounded-2xl ${bloodCfg.bg} border-2 ${bloodCfg.border} flex flex-col items-center justify-center`}
                  >
                    <Droplet
                      className={`w-4 h-4 ${bloodCfg.text} fill-current mb-0.5`}
                    />
                    <span
                      className={`text-lg font-extrabold leading-none ${bloodCfg.text}`}
                    >
                      {request.bloodGroup}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight font-[Georgia,serif]">
                      {request.bloodGroup} Blood Needed
                    </h1>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-sm truncate">
                        {request.hospital}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 pl-5">
                      {request.address}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-medium">
                      {request.unitsCollected} of {request.units} units
                      collected
                    </span>
                    <span className="font-bold text-rose-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[11px] text-gray-400">
                      {request.responders.length} donor
                      {request.responders.length !== 1 ? "s" : ""} responded
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Required by:{" "}
                      <span className="font-semibold text-gray-600">
                        {request.requiredBy}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-500" /> Patient
                Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Patient",
                    value: request.patientName,
                    icon: UserCircle,
                  },
                  {
                    label: "Age",
                    value: `${request.patientAge} years`,
                    icon: Calendar,
                  },
                  {
                    label: "Doctor",
                    value: request.doctorName,
                    icon: ShieldCheck,
                  },
                  { label: "Ward / Bed", value: request.ward, icon: BedDouble },
                  {
                    label: "Required By",
                    value: request.requiredBy,
                    icon: Clock,
                  },
                  {
                    label: "Units Needed",
                    value: `${request.units} units`,
                    icon: Droplet,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-3.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Condition */}
              <div className="mt-4 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-[11px] text-rose-400 uppercase tracking-wider font-bold mb-1">
                  Condition
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {request.patientCondition}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-rose-500" /> Important
                Notes
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {request.notes}
              </p>
            </div>

            {/* Responders */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                Responders
                <span className="ml-auto text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {request.responders.length}
                </span>
              </h2>

              {request.responders.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    No donors have responded yet. Be the first!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {request.responders.map((r) => (
                    <ResponderCard
                      key={r.id}
                      responder={r}
                      isOwner={isOwner}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="space-y-5">
            {/* Requester */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">
                Posted By
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    name={request.name}
                    avatar={request.avatar}
                    size={11}
                  />
                  {request.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{request.name}</p>
                  <p className="text-xs text-gray-400">{request.role}</p>
                  {request.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-500 font-semibold mt-0.5">
                      <BadgeCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${request.contactPhone}`}
                  className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-rose-600 transition-colors px-3 py-2.5 rounded-xl hover:bg-rose-50"
                >
                  <Phone className="w-4 h-4 text-rose-400" />
                  {request.contactPhone}
                </a>
                {request.contactEmail && (
                  <a
                    href={`mailto:${request.contactEmail}`}
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-rose-600 transition-colors px-3 py-2.5 rounded-xl hover:bg-rose-50"
                  >
                    <Mail className="w-4 h-4 text-rose-400" />
                    {request.contactEmail}
                  </a>
                )}
              </div>
            </div>

            {/* ── Respond Panel ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Already responded */}
              {alreadyResponded ? (
                <div className="p-5">
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3 ring-4 ring-green-100">
                      <CheckCircle2 className="w-7 h-7 text-green-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      You&apos;ve Responded!
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      The requester has been notified. They will contact you
                      shortly. Please keep your phone accessible.
                    </p>

                    {/* My status */}
                    {myStatus && (
                      <div
                        className={`w-full rounded-2xl p-3 ${STATUS_CONFIG[myStatus].bg}`}
                      >
                        <p className="text-[11px] text-gray-400 mb-1">
                          Your current status
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <StatusBadge status={myStatus} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status timeline */}
                  <div className="mt-4 border-t border-gray-50 pt-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">
                      What happens next?
                    </p>
                    {[
                      { step: "Response Sent", done: true },
                      {
                        step: "Requester Confirms",
                        done:
                          myStatus === "confirmed" || myStatus === "donated",
                      },
                      {
                        step: "Donate at Hospital",
                        done: myStatus === "donated",
                      },
                    ].map(({ step, done }, i) => (
                      <div key={i} className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-green-500" : "bg-gray-100"}`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold">
                              {i + 1}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs ${done ? "text-green-600 font-semibold" : "text-gray-400"}`}
                        >
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Respond form */
                <div>
                  <div className="bg-rose-600 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
                      <h3 className="text-sm font-bold text-white">
                        Respond to Donate
                      </h3>
                    </div>
                    <p className="text-xs text-rose-200 mt-1">
                      Your response saves a life.
                    </p>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Donor preview */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                      <Avatar name={ME.name} avatar={null} size={9} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {ME.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ME.bloodGroup} · {ME.donationsCount} donations
                        </p>
                      </div>
                      {ME.verified && (
                        <BadgeCheck className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>

                    {/* Compatibility check */}
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                      ${
                        ME.bloodGroup === request.bloodGroup
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {ME.bloodGroup === request.bloodGroup
                        ? `Your blood group (${ME.bloodGroup}) is a direct match!`
                        : `Your blood group (${ME.bloodGroup}) — confirm compatibility with the doctor.`}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block mb-1.5">
                        Message (optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. I'm available from 3 PM today..."
                        rows={3}
                        className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <button
                      onClick={handleRespond}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-rose-100 text-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> I Want to Donate
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                      By responding, your contact info will be shared with the
                      requester.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Needed", value: `${request.units}`, sub: "units" },
                {
                  label: "Collected",
                  value: `${request.unitsCollected}`,
                  sub: "units",
                },
                {
                  label: "Remaining",
                  value: `${request.units - request.unitsCollected}`,
                  sub: "units",
                },
              ].map(({ label, value, sub }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm"
                >
                  <p className="text-lg font-extrabold text-rose-600">
                    {value}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {sub}
                    <br />
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
