"use client";

import { useState } from "react";
import {
  PlusCircle,
  Megaphone,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Eye,
  Search,
  Filter,
  Hospital,
  Droplet,
} from "lucide-react";
import Link from "next/link";
import { dummyDonor } from "@/data/dummyDonor";

// ── Types ─────────────────────────────────────────────────────────────────────

type RequestStatus = "ACTIVE" | "FULFILLED" | "EXPIRED" | "CANCELLED";
type RequestUrgency = "EMERGENCY" | "URGENT" | "NORMAL";

interface BloodRequest {
  id: string;
  requestNo: string;
  bloodGroup: string;
  reason: string;
  hospital: string;
  urgency: RequestUrgency;
  respondedDonors: number;
  createdAt: string;
  status: RequestStatus;
}

// ── Extended dummy data ───────────────────────────────────────────────────────

const REQUESTS: BloodRequest[] = [
  ...dummyDonor.requestsMade,
  {
    id: "req_003",
    requestNo: "4612",
    bloodGroup: "A+",
    reason: "Pre-scheduled cardiac surgery",
    hospital: "Square Hospital, Dhaka",
    urgency: "NORMAL",
    respondedDonors: 2,
    createdAt: "2024-04-10T09:00:00.000Z",
    status: "FULFILLED",
  },
  {
    id: "req_004",
    requestNo: "4401",
    bloodGroup: "B+",
    reason: "Road accident victim — immediate need",
    hospital: "Dhaka Medical College Hospital",
    urgency: "EMERGENCY",
    respondedDonors: 0,
    createdAt: "2024-02-22T16:00:00.000Z",
    status: "EXPIRED",
  },
  {
    id: "req_005",
    requestNo: "4389",
    bloodGroup: "O-",
    reason: "Thalassemia monthly transfusion",
    hospital: "BIRDEM Hospital, Dhaka",
    urgency: "NORMAL",
    respondedDonors: 1,
    createdAt: "2024-01-18T11:30:00.000Z",
    status: "CANCELLED",
  },
] as BloodRequest[];

// ── Config maps ───────────────────────────────────────────────────────────────

const urgencyConfig: Record<RequestUrgency, { label: string; style: string }> =
  {
    EMERGENCY: {
      label: "Emergency",
      style: "text-rose-600 bg-rose-50 border-rose-100",
    },
    URGENT: {
      label: "Urgent",
      style: "text-amber-600 bg-amber-50 border-amber-100",
    },
    NORMAL: {
      label: "Normal",
      style: "text-blue-600 bg-blue-50 border-blue-100",
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ── Summary cards ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: number | string;
  label: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 leading-none">
          {value}
        </p>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ManageRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const [urgencyFilter, setUrgency] = useState<RequestUrgency | "ALL">("ALL");

  const filtered = REQUESTS.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.reason.toLowerCase().includes(q) ||
      r.hospital.toLowerCase().includes(q) ||
      r.requestNo.includes(q) ||
      r.bloodGroup.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchUrgency = urgencyFilter === "ALL" || r.urgency === urgencyFilter;
    return matchSearch && matchStatus && matchUrgency;
  });

  // Summary counts
  const total = REQUESTS.length;
  const active = REQUESTS.filter((r) => r.status === "ACTIVE").length;
  const fulfilled = REQUESTS.filter((r) => r.status === "FULFILLED").length;
  const totalResp = REQUESTS.reduce((sum, r) => sum + r.respondedDonors, 0);

  const selectClass =
    "bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all appearance-none cursor-pointer";

  return (
    <main className="py-10 container mx-auto w-full">
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
            My Requests
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage all blood requests you&apos;ve posted
          </p>
        </div>
        <Link
          href="/dashboard/requests/new"
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* ── SUMMARY CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          icon={Megaphone}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
          value={total}
          label="Total Requests"
        />
        <SummaryCard
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          value={active}
          label="Active"
        />
        <SummaryCard
          icon={CheckCircle2}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          value={fulfilled}
          label="Fulfilled"
        />
        <SummaryCard
          icon={Users}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
          value={totalResp}
          label="Total Responses"
        />
      </div>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-5 flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reason, hospital, blood group…"
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatus(e.target.value as RequestStatus | "ALL")
              }
              className={`${selectClass} pl-7 pr-6`}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Urgency filter */}
          <div className="relative">
            <AlertTriangle className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <select
              value={urgencyFilter}
              onChange={(e) =>
                setUrgency(e.target.value as RequestUrgency | "ALL")
              }
              className={`${selectClass} pl-7 pr-6`}
            >
              <option value="ALL">All Urgency</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="URGENT">Urgent</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TABLE — desktop ───────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Request
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">
                    Hospital
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">
                    Urgency
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">
                    Responses
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">
                    Posted
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((req) => {
                  const urgency = urgencyConfig[req.urgency];
                  const status = statusConfig[req.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Request info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                            <Droplet className="w-4 h-4 text-rose-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-rose-600">
                                #{req.requestNo}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="text-[10px] font-black text-gray-700">
                                {req.bloodGroup}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                              {req.reason}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-500 max-w-[160px] truncate">
                          {req.hospital}
                        </p>
                      </td>

                      {/* Urgency */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${urgency.style}`}
                        >
                          {urgency.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${status.style}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>

                      {/* Responses */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {req.respondedDonors}
                          </span>
                        </div>
                      </td>

                      {/* Posted */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-400">
                          {timeAgo(req.createdAt)}
                        </p>
                        <p className="text-[10px] text-gray-300">
                          {formatDate(req.createdAt)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/dashboard/manage-requests/${req.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="View"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </Link>
                          {req.status === "ACTIVE" && (
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── CARDS — mobile ─────────────────────────────────────────── */}
          <div className="sm:hidden space-y-3">
            {filtered.map((req) => {
              const urgency = urgencyConfig[req.urgency];
              const status = statusConfig[req.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                        <Droplet className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-rose-600">
                            #{req.requestNo}
                          </span>
                          <span className="text-[10px] font-black text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-md">
                            {req.bloodGroup}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">
                          {req.reason}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${status.style}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  {/* Hospital */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Hospital className="w-3 h-3 text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-400 truncate">
                      {req.hospital}
                    </p>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgency.style}`}
                      >
                        {urgency.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {req.respondedDonors} responses
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/requests/${req.id}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-gray-500" />
                      </Link>
                      {req.status === "ACTIVE" && (
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors">
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {timeAgo(req.createdAt)} · {formatDate(req.createdAt)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="bg-white border border-gray-100 rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Megaphone className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-500">No requests found</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            {search || statusFilter !== "ALL" || urgencyFilter !== "ALL"
              ? "Try adjusting your filters"
              : "You haven't posted any blood requests yet"}
          </p>
          <Link
            href="/dashboard/requests/new"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create First Request
          </Link>
        </div>
      )}

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-right">
          Showing{" "}
          <span className="font-bold text-gray-600">{filtered.length}</span> of{" "}
          <span className="font-bold text-gray-600">{total}</span> requests
        </p>
      )}
    </main>
  );
}
