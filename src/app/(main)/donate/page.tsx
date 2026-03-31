"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import toast from "react-hot-toast";

import RequestCard from "./components/RequestCard";
import CTACard from "./components/CTACard";
import UrgencyBadge from "./components/UrgencyBadge";
import { BloodGroup, BloodRequest, Urgency } from "./types";
import { BLOOD_GROUPS, ITEMS_PER_PAGE, URGENCIES, urgencyConfig } from "./data";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchRequests,
  fetchRequest,
  clearError,
  clearCurrentRequest,
  setPage,
} from "@/store/slices/requestsSlice";

export default function RequestsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    requests,
    loading,
    error,
    totalPages,
    currentPage,
    // totalRequests,
    currentRequest,
  } = useSelector((state: RootState) => state.requests);

  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState<BloodGroup | "">("");
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | "">("");
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(
    null,
  );

  // Fetch requests from backend whenever page or filters change
  useEffect(() => {
    const params: {
      page?: number;
      limit?: number;
      bloodGroup?: string;
      urgencyLevel?: string;
      status?: string;
    } = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: "pending",
    };

    if (bloodFilter) params.bloodGroup = bloodFilter;
    if (urgencyFilter) params.urgencyLevel = urgencyFilter.toLowerCase();

    dispatch(fetchRequests(params))
      .unwrap()
      .catch((err) => {
        const message =
          typeof err === "string" ? err : "Failed to load blood requests";
        toast.error(message);
      });
  }, [dispatch, currentPage, bloodFilter, urgencyFilter]);

  // Show and clear global errors from store
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.hospital.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q);
      const matchesBlood =
        !bloodFilter || (r.bloodGroup as BloodGroup) === bloodFilter;
      const matchesUrgency =
        !urgencyFilter || r.urgencyLevel === urgencyFilter.toLowerCase();
      return matchesSearch && matchesBlood && matchesUrgency;
    });
  }, [requests, search, bloodFilter, urgencyFilter]);

  // Paginate filtered results
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleFilterChange =
    <T extends string>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value as T);
      dispatch(setPage(1));
    };

  const handleViewRequest = (request: BloodRequest) => {
    setSelectedRequest(request);
    dispatch(fetchRequest(request._id))
      .unwrap()
      .catch((err) => {
        const message =
          typeof err === "string" ? err : "Failed to load request details";
        toast.error(message);
      });
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
              onChange={(e) => setSearch(e.target.value)}
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
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none -rotate-90" />
          </div>
        </section>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <p className="text-gray-400 mt-4">Loading requests...</p>
          </div>
        ) : paginatedRequests.length === 0 ? (
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
            {paginatedRequests.map((r) => (
              <RequestCard
                key={r._id}
                request={r as BloodRequest}
                onViewDetails={() => handleViewRequest(r as BloodRequest)}
              />
            ))}
            {/* CTA card only on last page */}
            {currentPage === totalPages && <CTACard />}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-10">
          <p className="text-gray-400 text-sm font-medium">
            Showing{" "}
            <span className="text-gray-900 font-bold">
              {paginatedRequests.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 font-bold">
              {filteredRequests.length}
            </span>{" "}
            active requests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}
              disabled={currentPage === 1 || loading}
              aria-label="Previous page"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from(
              {
                length:
                  totalPages ||
                  Math.ceil(filteredRequests.length / ITEMS_PER_PAGE),
              },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => dispatch(setPage(p))}
                disabled={loading}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  p === currentPage
                    ? "bg-rose-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() =>
                dispatch(
                  setPage(
                    Math.min(
                      totalPages ||
                        Math.ceil(filteredRequests.length / ITEMS_PER_PAGE),
                      currentPage + 1,
                    ),
                  ),
                )
              }
              disabled={
                currentPage ===
                  (totalPages ||
                    Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)) ||
                loading
              }
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
      {selectedRequest && currentRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedRequest(null);
              dispatch(clearCurrentRequest());
            }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 shadow-xl flex flex-col gap-6 animate-in fade-in">
            {/* Close */}
            <button
              onClick={() => {
                setSelectedRequest(null);
                dispatch(clearCurrentRequest());
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-10">
              <div
                className={`w-12 h-12 rounded-xl ${urgencyConfig[currentRequest.urgencyLevel].blood} flex items-center justify-center shrink-0`}
              >
                <span
                  className={`text-lg font-extrabold ${urgencyConfig[currentRequest.urgencyLevel].bloodText}`}
                >
                  {currentRequest.bloodGroup}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Blood Request #{currentRequest.requestNumber}
                </h2>

                <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">
                    {currentRequest.hospital}, {currentRequest.district}
                  </span>
                </div>
              </div>

              {/* Urgency */}
              <UrgencyBadge urgency={currentRequest.urgencyLevel as Urgency} />
            </div>

            {/* Patient Info */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Patient Information
              </p>
              <div className="space-y-1">
                <p className="text-gray-800 font-medium">
                  {currentRequest.patientName}
                </p>
                <p className="text-gray-600 text-sm">
                  {currentRequest.patientAge} years old •{" "}
                  {currentRequest.patientGender} •{" "}
                  {currentRequest.patientCondition}
                </p>
              </div>
            </div>

            {/* Message (special instructions) */}
            {currentRequest.specialInstructions && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Special Instructions
                </p>
                <p className="text-gray-800 leading-relaxed text-sm">
                  {currentRequest.specialInstructions}
                </p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase">Posted</p>
                <p className="font-semibold text-gray-900">
                  {getTimeAgo(currentRequest.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Required By</p>
                <p className="font-semibold text-gray-900">
                  {new Date(currentRequest.requiredBy).toLocaleDateString()}
                  {currentRequest.requiredByTime &&
                    ` ${currentRequest.requiredByTime}`}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Units</p>
                <p className="font-semibold text-gray-900">
                  {currentRequest.unitsRequired}{" "}
                  {currentRequest.unitsRequired === 1 ? "Unit" : "Units"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">Component</p>
                <p className="font-semibold text-gray-900">
                  {currentRequest.componentType.replace("_", " ").toUpperCase()}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Contact Information
              </p>
              <div className="space-y-1">
                <p className="text-gray-800 font-medium">
                  {currentRequest.requesterName}
                </p>
                <p className="text-gray-600 text-sm">
                  {currentRequest.relation} • {currentRequest.contactPhone}
                </p>
                {currentRequest.contactEmail && (
                  <p className="text-gray-600 text-sm">
                    {currentRequest.contactEmail}
                  </p>
                )}
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
