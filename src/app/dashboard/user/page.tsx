"use client";

import { useState } from "react";
import { User, Settings, Bell, Heart, LogOut, Search, Activity, Calendar, History, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:h-screen md:sticky top-0 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
            JD
          </div>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">John Doe</h2>
            <p className="text-xs font-semibold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-sm mt-0.5">O+ Donor</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Activity className="h-5 w-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <History className="h-5 w-5" /> Donation History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings className="h-5 w-5" /> Profile Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, John!</h1>
            <p className="text-slate-500 font-medium">Here's your donation activity and profile status.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:border-primary/20 transition-colors">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="h-7 w-7 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Lives Saved (est.)</p>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">12</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:border-primary/20 transition-colors">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="h-7 w-7 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Total Donations</p>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">4</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:border-primary/20 transition-colors">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="h-7 w-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Next Eligible</p>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Ready Now</h3>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Donor Availability Status
                    {isAvailable && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 max-w-xl">
                    Turning this on makes your profile visible to local emergency requests for O+ blood. We will only contact you when there's an urgent match.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-3' : '-translate-x-3'}`} />
                </button>
              </div>
            </div>
            
            {/* Recent Emergency Hits (mock) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Local Urgent Requests (Matches Profile)</h3>
                <Link href="/donors" className="text-sm font-semibold text-primary hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs">CRITICAL</span>
                      <h4 className="font-bold text-slate-900">O+ Blood Needed - Surgery</h4>
                    </div>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Dhaka Medical College, Ward 3</p>
                  </div>
                  <button className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-800 transition-all shrink-0">
                    Respond / Accept
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Past Donations</h3>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 uppercase text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="px-6 py-4">12 Oct 2023</td>
                  <td className="px-6 py-4">City General Hospital</td>
                  <td className="px-6 py-4">450ml (Whole Blood)</td>
                  <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">Successful</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors font-medium">
                  <td className="px-6 py-4">05 May 2023</td>
                  <td className="px-6 py-4">Red Cross Camp, Uttara</td>
                  <td className="px-6 py-4">450ml (Whole Blood)</td>
                  <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">Successful</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Profile Settings Mock */}
        {activeTab === 'settings' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
             <h3 className="font-bold text-xl text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Information</h3>
             <div className="space-y-4 max-w-xl">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" readOnly value="John Doe" className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium cursor-not-allowed" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input type="text" defaultValue="Dhaka" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:border-primary outline-none" />
               </div>
               <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg mt-4 shadow-sm hover:bg-red-700 transition">Save Changes</button>
             </div>
           </div>
        )}

      </main>
    </div>
  );
}
