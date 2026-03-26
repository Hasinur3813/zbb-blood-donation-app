"use client";

import { useState } from "react";
import { Search, MapPin, Filter, User, Calendar, CheckCircle2, Clock } from "lucide-react";

// Mock Data
const MOCK_DONORS = [
  { id: 1, name: "Ahmed R.", group: "A+", location: "Dhaka", available: true, lastDonation: "2023-11-15", distance: "2.4 km" },
  { id: 2, name: "Sarah J.", group: "O-", location: "Chittagong", available: true, lastDonation: "2024-01-20", distance: "5.1 km" },
  { id: 3, name: "John M.", group: "B+", location: "Dhaka", available: false, lastDonation: "2024-03-01", distance: "1.2 km" },
  { id: 4, name: "Fatima A.", group: "AB+", location: "Sylhet", available: true, lastDonation: "2023-09-10", distance: "12.0 km" },
  { id: 5, name: "Rahim K.", group: "O+", location: "Dhaka", available: true, lastDonation: "2023-12-05", distance: "3.8 km" },
  { id: 6, name: "Ayesha T.", group: "A-", location: "Barisal", available: false, lastDonation: "2024-02-15", distance: "8.5 km" },
];

export default function DonorsPage() {
  const [filterGroup, setFilterGroup] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredDonors = MOCK_DONORS.filter(donor => {
    if (filterGroup && donor.group !== filterGroup) return false;
    if (filterLocation && !donor.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    if (showAvailableOnly && !donor.available) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Blood Donors
          </h1>
          <p className="text-muted-foreground">
            Search our active pool of generous donors. Connect directly and find the perfect match for your emergency needs.
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
                <label className="text-sm font-medium text-slate-700 block mb-2">Blood Group</label>
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
                <label className="text-sm font-medium text-slate-700 block mb-2">Location/City</label>
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
                <label htmlFor="availableOnly" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Show Available Only
                </label>
              </div>

              <button 
                onClick={() => { setFilterGroup(""); setFilterLocation(""); setShowAvailableOnly(false); }}
                className="w-full py-2 mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <p className="text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredDonors.length}</span> donors
              </p>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline">Sort by:</span>
                <select className="bg-transparent font-medium text-slate-900 outline-none border-b border-dashed border-slate-300 pb-0.5 custom-select">
                  <option>Distance</option>
                  <option>Recent First</option>
                </select>
              </div>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">No Donors Found</h3>
                <p className="text-slate-500 max-w-sm">
                  Try adjusting your filters to find a match. Sometimes exploring nearby cities can yield better results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-rows-max gap-6">
                {filteredDonors.map((donor) => (
                  <div key={donor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all flex flex-col gap-4">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
                          <User className="h-6 w-6 opacity-30" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 leading-tight">{donor.name}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {donor.location} ({donor.distance})
                          </p>
                        </div>
                      </div>
                      
                      {/* Blood Badge */}
                      <div className={`px-3 py-2 rounded-lg font-extrabold text-lg flex items-center justify-center min-w-[3rem] ${donor.group.includes('-') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                        {donor.group}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Last Donated</p>
                          <p className="font-medium text-slate-800">{donor.lastDonation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {donor.available ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Status</p>
                          <span className={`font-semibold ${donor.available ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {donor.available ? 'Ready to Donate' : 'On Cooldown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <button 
                      disabled={!donor.available}
                      className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors text-center disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 border disabled:cursor-not-allowed bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    >
                      {donor.available ? 'Contact Donor' : 'Not Available Currently'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination Dummy */}
            {filteredDonors.length > 0 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">Prev</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white text-sm font-medium shadow-sm">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors">3</button>
                  <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Next</button>
                </nav>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}
