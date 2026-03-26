"use client";

import { Users, Activity, Droplet, Settings, LogOut, Search, MapPin, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 md:h-screen md:sticky top-0 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold leading-tight">Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-0.5">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Activity className="h-5 w-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Users className="h-5 w-5" /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'requests' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Droplet className="h-5 w-5" /> Blood Requests
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-slate-300 hover:bg-white/10 hover:text-white`}
          >
            <Settings className="h-5 w-5" /> System Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-white/5 transition-colors">
            <LogOut className="h-5 w-5" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        
        {activeTab === 'overview' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">System Analytics Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Total Active Donors</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">4,281</h3>
                <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">+12% this month</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Pending Requests</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">56</h3>
                <p className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1">12 Critical</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Successful Matches</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">1,093</h3>
                <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">All time</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Platform Issues</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">0</h3>
                <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">Systems Normal</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-96 flex justify-center items-center">
               <p className="text-slate-400 font-medium">Analytics Dashboard Chart Area</p>
            </div>
          </>
        )}

        {activeTab === 'users' && (
           <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Users</h1>
                <div className="relative">
                  <input type="text" placeholder="Search users by name or email..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 md:w-80 outline-none focus:border-primary text-sm font-medium bg-white" />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900 uppercase text-xs font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">John Doe</div>
                        <div className="text-xs text-slate-500">john@example.com</div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">Donor</span></td>
                      <td className="px-6 py-4"><span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Active</span></td>
                      <td className="px-6 py-4">
                        <button className="text-primary font-semibold hover:underline text-sm mr-3">Edit</button>
                        <button className="text-red-600 font-semibold hover:underline text-sm">Ban</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">Sarah Jenkins</div>
                        <div className="text-xs text-slate-500">sarah@example.com</div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">Patient</span></td>
                      <td className="px-6 py-4"><span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Active</span></td>
                      <td className="px-6 py-4">
                        <button className="text-primary font-semibold hover:underline text-sm mr-3">Edit</button>
                        <button className="text-red-600 font-semibold hover:underline text-sm">Ban</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
           </>
        )}

        {activeTab === 'requests' && (
           <>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">Blood Requests Dashboard</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 bg-slate-50 flex gap-4">
                    <button className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-sm font-semibold">Pending (2)</button>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full text-sm font-semibold">Resolved (148)</button>
                 </div>
                 <div className="divide-y divide-slate-100 p-2">
                    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 rounded-xl transition-colors">
                       <div className="flex gap-4">
                          <div className="w-14 h-14 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center justify-center font-black text-xl shrink-0">B+</div>
                          <div>
                             <h4 className="font-bold text-lg text-slate-900 leading-tight">CRITICAL: Surgery Patient</h4>
                             <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1"><MapPin className="h-4 w-4" /> Dhaka Medical College</p>
                             <p className="text-sm text-slate-500 mt-1">Requested by: Mrs. Farhana (017xxxxxxxx)</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                          <button className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-sm transition text-center flex items-center justify-center gap-2">
                            Broadcast Manually
                          </button>
                          <button className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm transition text-center">
                            Mark Resolved
                          </button>
                           <button className="p-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 rounded-lg transition-colors">
                              <XCircle className="h-5 w-5" />
                           </button>
                       </div>
                    </div>
                 </div>
              </div>
           </>
        )}

      </main>
    </div>
  );
}

// Icon helper since ShieldCheck isn't exported directly in the lucide-react import above
function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-3 5.96-8.94a1.03 1.03 0 0 1 1.95 0c1.96 5.95 4 7.94 6 8.94a1 1 0 0 1 1 1v7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
