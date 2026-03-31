"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import DonorCard from "@/components/ui/DonorCard/DonorCard";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDonors, setFilters, clearFilters, setPage } from "@/store";
import toast, { Toaster } from "react-hot-toast";

export default function DonorsPage() {
  const dispatch = useAppDispatch();
  const { donors, loading, error, totalPages, currentPage, filters } =
    useAppSelector((state) => state.donors);

  const [filterGroup, setFilterGroup] = useState(filters.bloodGroup);
  const [filterLocation, setFilterLocation] = useState(filters.city);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Fetch donors on mount and when filters change
  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch, filters, currentPage]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = () => {
    dispatch(
      setFilters({
        bloodGroup: filterGroup,
        city: filterLocation,
      }),
    );
  };

  const handleResetFilters = () => {
    setFilterGroup("");
    setFilterLocation("");
    setShowAvailableOnly(false);
    dispatch(clearFilters());
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  // Filter donors locally for available only (since backend doesn't support this filter yet)
  const filteredDonors = showAvailableOnly
    ? donors.filter((donor) => donor.isAvailable)
    : donors;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Blood Donors
          </h1>
          <p className="text-muted-foreground">
            Search our active pool of generous donors. Connect directly and find
            the perfect match for your emergency needs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative box-border">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Filter className="h-5 w-5 text-primary" />
              Filter Donors
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Blood Group
                </label>
                <select
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                >
                  <option value="">All Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Location/City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Dhaka"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="availableOnly"
                  className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary cursor-pointer accent-primary"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                />
                <label
                  htmlFor="availableOnly"
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Show Available Only
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFilterChange}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <p className="text-slate-600 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredDonors.length}
                </span>{" "}
                donors
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline">Sort by:</span>
                <select className="bg-transparent font-medium text-slate-900 outline-none border-b border-dashed border-slate-300 pb-0.5 custom-select">
                  <option>Distance</option>
                  <option>Recent First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-slate-600">Loading donors...</span>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  No Donors Found
                </h3>
                <p className="text-slate-500 max-w-sm">
                  Try adjusting your filters to find a match. Sometimes
                  exploring nearby cities can yield better results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-max gap-6">
                {filteredDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
