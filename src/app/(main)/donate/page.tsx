"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { getTimeAgo } from "@/lib/timeAgo";

import RequestCard from "./components/RequestCard";
import CTACard from "./components/CTACard";
import UrgencyBadge from "./components/UrgencyBadge";
import { BloodGroup, BloodRequest, Urgency } from "./types";
import {
  BLOOD_GROUPS,
  ITEMS_PER_PAGE,
  REQUESTS,
  URGENCIES,
  urgencyConfig,
} from "./data";

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState<BloodGroup | "">("");
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | "">("");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(
    null,
  );

  const filtered = useMemo(() => {
    return REQUESTS.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.hospital.toLowerCase().includes(q);
      const matchesBlood = !bloodFilter || r.bloodGroup === bloodFilter;
      const matchesUrgency = !urgencyFilter || r.urgency === urgencyFilter;
      return matchesSearch && matchesBlood && matchesUrgency;
    });
  }, [search, bloodFilter, urgencyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleFilterChange =
    (setter: (v: any) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const selectClass =
    "w-full appearance-none bg-white border border-gray-200 rounded-2xl py-3.5 px-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-200 transition-all";

  return (
    <>
      <main className="container grow pt-32 pb-28 px-4 mx-auto w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
            Active <span className="text-rose-600">Blood Requests</span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
            Review current needs within your community. Every second counts when
            a life is on the line. Use the filters to find a match you can
            assist with.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <section className="bg-gray-50 border border-gray-100 rounded-3xl p-5 mb-10 flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-200 transition-all"
              placeholder="Search by hospital, city or patient name…"
              type="text"
            />
          </div>

          {/* Blood Group */}
          <div className="relative w-full lg:w-44">
            <select
              value={bloodFilter}
              onChange={handleFilterChange(setBloodFilter)}
              className={selectClass}
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none -rotate-90" />
          </div>

          {/* Urgency */}
          <div className="relative w-full lg:w-44">
            <select
              value={urgencyFilter}
              onChange={handleFilterChange(setUrgencyFilter)}
              className={selectClass}
            >
              <option value="">Any Urgency</option>
              {URGENCIES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none -rotate-90" />
          </div>
        </section>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-semibold">
              No requests match your filters.
            </p>
            <p className="text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
            {/* CTA card only on last page */}
            {page === totalPages && <CTACard />}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-10">
          <p className="text-gray-400 text-sm font-medium">
            Showing{" "}
            <span className="text-gray-900 font-bold">{filtered.length}</span>{" "}
            of <span className="text-gray-900 font-bold">24</span> active
            requests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  p === page
                    ? "bg-rose-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          aria-label="Add new request"
          className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl hover:bg-rose-700 active:scale-90 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-xl flex flex-col gap-6 animate-in fade-in">
            {/* Close */}
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-10">
              <div
                className={`w-12 h-12 rounded-xl ${urgencyConfig[selectedRequest.urgency].blood} flex items-center justify-center shrink-0`}
              >
                <span
                  className={`text-lg font-extrabold ${urgencyConfig[selectedRequest.urgency].bloodText}`}
                >
                  {selectedRequest.bloodGroup}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Blood Request
                </h2>

                <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">{selectedRequest.hospital}</span>
                </div>
              </div>

              {/* Urgency */}
              <UrgencyBadge urgency={selectedRequest.urgency} />
            </div>

            {/* Message (clean focus) */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Message
              </p>
              <p className="text-gray-800 leading-relaxed text-sm">
                {selectedRequest.message}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase">Posted</p>
                <p className="font-semibold text-gray-900">
                  {getTimeAgo(selectedRequest.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Required</p>
                <p className="font-semibold text-gray-900">
                  {selectedRequest.requiredBy}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Units</p>
                <p className="font-semibold text-gray-900">
                  {selectedRequest.units}{" "}
                  {selectedRequest.units === 1 ? "Pint" : "Pints"}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Button variant="primary" size="lg" className="w-full">
              Donate Now
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
