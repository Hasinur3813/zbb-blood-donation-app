"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Droplet,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Trash2,
  Ban,
  RefreshCw,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

type RequestStatus = "ACTIVE" | "FULFILLED" | "EXPIRED" | "CANCELLED";
type RequestUrgency = "EMERGENCY" | "URGENT" | "NORMAL";
type DonorStatus = "PENDING" | "CONFIRMED" | "DECLINED";

interface RespondedDonor {
  id: string;
  name: string;
  avatar?: string;
  bloodGroup: string;
  phone: string;
  city: string;
  verified: boolean;
  respondedAt: string;
  status: DonorStatus;
}

interface BloodRequest {
  id: string;
  requestNo: string;
  bloodGroup: string;
  reason: string;
  hospital: string;
  address: string;
  urgency: RequestUrgency;
  unitsNeeded: number;
  requiredBy: string;
  patientName: string;
  contactPhone: string;
  note: string;
  respondedDonors: RespondedDonor[];
  createdAt: string;
  status: RequestStatus;
}

// ── Dummy data ────────────────────────────────────────────────────────────────

const REQUEST: BloodRequest = {
  id: "req_001",
  requestNo: "4920",
  bloodGroup: "B+",
  reason: "Type B+ required for surgery",
  hospital: "St. Jude Medical Center",
  address: "250 East Superior Street, Chicago, IL 60611",
  urgency: "URGENT",
  unitsNeeded: 3,
  requiredBy: "2024-09-05T12:00:00.000Z",
  patientName: "Sarah Jenkins",
  contactPhone: "+8801712345678",
  note: "Please contact as soon as possible. Surgery is scheduled. Any B+ or O- donor is urgently needed.",
  createdAt: "2024-09-01T08:00:00.000Z",
  status: "ACTIVE",
  respondedDonors: [
    {
      id: "d_001",
      name: "Rahim Uddin",
      bloodGroup: "B+",
      phone: "+8801811223344",
      city: "Dhaka",
      verified: true,
      respondedAt: "2024-09-01T10:30:00.000Z",
      status: "CONFIRMED",
    },
    {
      id: "d_002",
      name: "Karim Hassan",
      avatar: "",
      bloodGroup: "O-",
      phone: "+8801922334455",
      city: "Dhaka",
      verified: true,
      respondedAt: "2024-09-01T13:15:00.000Z",
      status: "PENDING",
    },
    {
      id: "d_003",
      name: "Fatema Begum",
      bloodGroup: "B+",
      phone: "+8801633445566",
      city: "Dhaka",
      verified: false,
      respondedAt: "2024-09-02T09:00:00.000Z",
      status: "PENDING",
    },
    {
      id: "d_004",
      name: "Mostak Ahmed",
      bloodGroup: "B+",
      phone: "+8801744556677",
      city: "Narayanganj",
      verified: true,
      respondedAt: "2024-09-02T14:00:00.000Z",
      status: "DECLINED",
    },
  ],
};

// ── Config ────────────────────────────────────────────────────────────────────

const urgencyConfig: Record<RequestUrgency, { label: string; style: string }> =
  {
    EMERGENCY: {
      label: "Emergency",
      style: "text-rose-600 bg-rose-50 border border-rose-100",
    },
    URGENT: {
      label: "Urgent",
      style: "text-amber-600 bg-amber-50 border border-amber-100",
    },
    NORMAL: {
      label: "Normal",
      style: "text-blue-600 bg-blue-50 border border-blue-100",
    },
  };

const statusConfig: Record<
  RequestStatus,
  { label: string; style: string; icon: React.ElementType }
> = {
  ACTIVE: {
    label: "Active",
    style: "text-emerald-600 bg-emerald-50",
    icon: Clock,
  },
  FULFILLED: {
    label: "Fulfilled",
    style: "text-blue-600 bg-blue-50",
    icon: CheckCircle2,
  },
  EXPIRED: {
    label: "Expired",
    style: "text-gray-400 bg-gray-100",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    style: "text-rose-400 bg-rose-50",
    icon: XCircle,
  },
};

const donorStatusConfig: Record<DonorStatus, { label: string; style: string }> =
  {
    PENDING: {
      label: "Pending",
      style: "text-amber-600 bg-amber-50 border border-amber-100",
    },
    CONFIRMED: {
      label: "Confirmed",
      style: "text-emerald-600 bg-emerald-50 border border-emerald-100",
    },
    DECLINED: {
      label: "Declined",
      style: "text-gray-400 bg-gray-100 border border-gray-200",
    },
  };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ManageSingleRequestPage() {
  const { id } = useParams<{ id: string }>();
  // In production: fetch request by `id`
  const req = REQUEST;

  const [donorStatuses, setDonorStatuses] = useState<
    Record<string, DonorStatus>
  >(Object.fromEntries(req.respondedDonors.map((d) => [d.id, d.status])));

  const [reqStatus, setReqStatus] = useState<RequestStatus>(req.status);

  const updateDonorStatus = (donorId: string, status: DonorStatus) => {
    setDonorStatuses((prev) => ({ ...prev, [donorId]: status }));
  };

  const statusCfg = statusConfig[reqStatus];
  const urgencyCfg = urgencyConfig[req.urgency];
  const StatusIcon = statusCfg.icon;

  const confirmedCount = Object.values(donorStatuses).filter(
    (s) => s === "CONFIRMED",
  ).length;
  const pendingCount = Object.values(donorStatuses).filter(
    (s) => s === "PENDING",
  ).length;
  const isActive = reqStatus === "ACTIVE";

  const whatsappText = (donor: RespondedDonor) =>
    encodeURIComponent(
      `Hi ${donor.name}, thank you for responding to blood request #${req.requestNo}. We need ${req.bloodGroup} blood at ${req.hospital}. Please confirm your availability.`,
    );

  return (
    <main className="container py-10 mx-auto w-full" data-request-id={id}>
      {/* Back */}
      <Link
        href="/dashboard/manage-requests"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Requests
      </Link>

      {/* ── HEADER CARD ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-5">
        <div className="h-1 w-full bg-linear-to-r from-rose-500 via-rose-400 to-orange-400" />

        <div className="p-5 sm:p-7">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              {/* Blood group bubble */}
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <span className="text-xl font-black text-rose-600">
                  {req.bloodGroup}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-black text-rose-600">
                    #{req.requestNo}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${urgencyCfg.style}`}
                  >
                    {urgencyCfg.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusCfg.style}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusCfg.label}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                  {req.reason}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Posted {timeAgo(req.createdAt)} · {formatDate(req.createdAt)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {isActive && (
              <div className="flex gap-2 self-start">
                <button
                  onClick={() => setReqStatus("FULFILLED")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors border border-emerald-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Fulfilled
                </button>
                <button
                  onClick={() => setReqStatus("CANCELLED")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors border border-rose-100"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}

            {!isActive && (
              <button
                onClick={() => setReqStatus("ACTIVE")}
                className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reopen
              </button>
            )}
          </div>

          {/* Progress bar — units confirmed */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-600">
                Donors Confirmed
              </p>
              <p className="text-xs font-black text-gray-900">
                {confirmedCount} / {req.unitsNeeded} units
              </p>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (confirmedCount / req.unitsNeeded) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {confirmedCount >= req.unitsNeeded
                ? "✓ Required units met"
                : `${req.unitsNeeded - confirmedCount} more unit${req.unitsNeeded - confirmedCount > 1 ? "s" : ""} needed`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        {/* ── REQUEST DETAILS ────────────────────────────────────────── */}
        <div className="sm:col-span-5 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1">
              Request Details
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Information about this blood request
            </p>

            <InfoRow
              icon={Droplet}
              label="Blood Group"
              value={req.bloodGroup}
            />
            <InfoRow
              icon={Users}
              label="Units Needed"
              value={`${req.unitsNeeded} Pint${req.unitsNeeded > 1 ? "s" : ""}`}
            />
            <InfoRow icon={MapPin} label="Hospital" value={req.hospital} />
            <InfoRow icon={MapPin} label="Address" value={req.address} />
            <InfoRow
              icon={Calendar}
              label="Required By"
              value={formatDate(req.requiredBy)}
            />
            <InfoRow
              icon={UserCircle}
              label="Patient"
              value={req.patientName}
            />
            <InfoRow icon={Phone} label="Contact" value={req.contactPhone} />
          </div>

          {/* Note */}
          {req.note && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                Note
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                {req.note}
              </p>
            </div>
          )}

          {/* Danger zone */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-gray-900 mb-1">Danger Zone</p>
            <p className="text-xs text-gray-400 mb-4">
              This action is irreversible
            </p>
            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 py-2.5 rounded-xl transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete Request
            </button>
          </div>
        </div>

        {/* ── RESPONDED DONORS ───────────────────────────────────────── */}
        <div className="sm:col-span-7">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Responded Donors
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {req.respondedDonors.length} responded ·{" "}
                  <span className="text-emerald-600 font-semibold">
                    {confirmedCount} confirmed
                  </span>
                  {pendingCount > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      <span className="text-amber-600 font-semibold">
                        {pendingCount} pending
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {req.respondedDonors.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  No donors yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Donors will appear here once they respond
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {req.respondedDonors.map((donor) => {
                  const currentStatus = donorStatuses[donor.id];
                  const dsCfg = donorStatusConfig[currentStatus];

                  return (
                    <div
                      key={donor.id}
                      className={`border rounded-2xl p-4 transition-colors ${
                        currentStatus === "DECLINED"
                          ? "opacity-50 bg-gray-50 border-gray-100"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      {/* Donor header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            {donor.avatar ? (
                              <Image
                                src={donor.avatar}
                                alt={donor.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                                <UserCircle className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            {/* Blood group chip */}
                            <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[8px] font-black px-1 py-0.5 rounded-md leading-tight shadow">
                              {donor.bloodGroup}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-gray-900">
                                {donor.name}
                              </p>
                              {donor.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {donor.city}
                            </p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${dsCfg.style}`}
                        >
                          {dsCfg.label}
                        </span>
                      </div>

                      {/* Responded at */}
                      <p className="text-[10px] text-gray-400 mb-3">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Responded {formatDateTime(donor.respondedAt)}
                      </p>

                      {/* Action row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${donor.phone.replace(/\D/g, "")}?text=${whatsappText(donor)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>

                        {/* Call */}
                        <a
                          href={`tel:${donor.phone}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>

                        {/* Confirm / Decline — only for PENDING */}
                        {isActive && currentStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                updateDonorStatus(donor.id, "CONFIRMED")
                              }
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateDonorStatus(donor.id, "DECLINED")
                              }
                              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Decline
                            </button>
                          </>
                        )}

                        {/* Undo confirm */}
                        {isActive && currentStatus === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateDonorStatus(donor.id, "PENDING")
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Undo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
