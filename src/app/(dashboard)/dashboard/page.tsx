"use client";

import {
  CheckCircle,
  Pencil,
  Heart,
  Droplet,
  CalendarCheck,
  Syringe,
  Home,
  AlertTriangle,
  Megaphone,
  PlusCircle,
  Bell,
} from "lucide-react";

export default function UserDashboard() {
  return (
    <main className="pt-28 pb-20 px-4 container mx-auto">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBszC17M5Jb9qLVy1P9uX3a-wYsI5QltiNrE4jYs3m6y4Ce8mFO6yLTAtKI7qL61J0G2HmYMlVl_fsCcHrxbPst65aicIX9UAwAzhAr4rR00BjHdJZLyjEgCqUQbB1ufoPg7_ZCHOZHvWbMMAe3gFoik_YjFsOe2IxVKXV86vbL7O4m8WMMi6mG46W7U98o8IbmxA3VbARlySf9ynzVV-NYy9OMNveDGdFucVFAyr-9BwD697skNlxPVLsSTN6_B2ss2els9Snemy4"
              alt="User profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg"
            />

            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
              <CheckCircle className="text-primary w-5 h-5" />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex justify-center gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Alex Mercer
              </h1>
              {/* verified/non verified badge */}
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary w-5 h-5" />
                <span className="text-primary font-bold">Verified</span>
              </div>
            </div>
            <p className="text-gray-500 font-medium text-lg mt-1">
              O- Negative Donor •{" "}
              <span className="text-primary">Super Hero Status</span>
            </p>
          </div>
        </div>

        {/* Edit */}
        <button className="bg-gray-100 text-primary px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition-all">
          <Pencil className="w-5 h-5" />
          Edit Profile
        </button>
      </header>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Availability */}
        <div className="md:col-span-4 bg-gray-50 p-8 rounded-4xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Availability Status</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Toggle your status to appear in donor searches for emergency blood
              requests.
            </p>
          </div>

          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
            <span className="font-bold">Ready to Donate</span>
            <button className="w-14 h-8 bg-primary rounded-full relative">
              <div className="absolute right-1 top-1 bg-white w-6 h-6 rounded-full shadow-sm" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-8 rounded-4xl flex flex-col justify-center">
            <Heart className="text-primary mb-4 w-8 h-8" />
            <p className="text-4xl font-black">12</p>
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Lives Impacted
            </p>
          </div>

          <div className="bg-gray-100 p-8 rounded-4xl flex flex-col justify-center">
            <Droplet className="text-blue-500 mb-4 w-8 h-8" />
            <p className="text-4xl font-black">5.4L</p>
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Total Donated
            </p>
          </div>

          <div className="bg-gray-100 p-8 rounded-4xl flex flex-col justify-center">
            <CalendarCheck className="text-green-500 mb-4 w-8 h-8" />
            <p className="text-4xl font-black">Oct 14</p>
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Next Eligibility
            </p>
          </div>
        </div>

        {/* History */}
        <div className="md:col-span-7 bg-gray-100 rounded-4xl p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold">Donation History</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-1">
              View All →
            </button>
          </div>

          <div className="space-y-8">
            {/* Item */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Syringe />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">St. Jude Medical Center</h4>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    COMPLETED
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Whole Blood Donation • August 24, 2024
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Home />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">Community Blood Drive</h4>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    COMPLETED
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Platelets Donation • May 12, 2024
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <AlertTriangle />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold">City Emergency Unit</h4>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                    EXPIRED
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Emergency Request • Jan 05, 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="md:col-span-5 bg-gray-200 rounded-4xl p-8">
          <h3 className="text-2xl font-bold mb-8">Requests Made</h3>

          <div className="bg-white p-6 rounded-3xl mb-6 shadow-sm relative">
            <div className="flex justify-between mb-4">
              <Megaphone />
              <span className="text-xs font-bold bg-yellow-200 px-3 py-1 rounded-full">
                URGENT
              </span>
            </div>

            <h4 className="font-bold text-lg">Blood Request #4920</h4>
            <p className="text-sm text-gray-500 mb-4">
              Type B+ required for surgery.
            </p>

            <div className="flex justify-between border-t pt-4">
              <span className="text-xs text-gray-500">4 Donors Responded</span>
              <button className="text-primary text-xs font-bold">Manage</button>
            </div>
          </div>

          <button className="w-full py-4 border-2 border-dashed rounded-3xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100">
            <PlusCircle />
            Create New Request
          </button>
        </div>
      </div>

      {/* ALERT */}
      <section className="mt-12 bg-primary/5 p-8 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6 border">
        <div className="flex items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-20"></span>
            <div className="relative rounded-full h-12 w-12 bg-primary flex items-center justify-center">
              <Bell className="text-white" />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold">Urgent Need Near You</h4>
            <p className="text-gray-500 max-w-md">
              Someone needs O- blood urgently. Your contribution could save a
              life.
            </p>
          </div>
        </div>

        <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow hover:scale-105 transition">
          Accept Request
        </button>
      </section>
    </main>
  );
}
