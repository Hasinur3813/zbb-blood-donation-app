"use client";

import { useState } from "react";
import { FlaskConical, X, ShieldAlert } from "lucide-react";

export function DevBanner() {
  const [open, setOpen] = useState(true);

  // Show once per session
  //   useEffect(() => {
  //     // Only run this code if window is available (i.e., client-side)
  //     const dismissed =
  //       typeof window !== "undefined"
  //         ? sessionStorage.getItem("dev-modal-dismissed")
  //         : "true";
  //     if (!dismissed) {
  //       // Use a microtask to escape initial effect trigger and avoid cascading renders
  //       Promise.resolve().then(() => setOpen(true));
  //     }
  //   }, []);

  const handleClose = () => {
    // sessionStorage.setItem("dev-modal-dismissed", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-rose-500 to-amber-400" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FlaskConical className="w-2.5 h-2.5" />
                  Beta Version
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-1 leading-tight font-[Georgia,serif]">
                ডেভেলপমেন্ট নোটিশ
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Bangla notice */}
          <div
            className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-4 space-y-2.5"
            style={{
              fontFamily: "'Hind Siliguri', 'SolaimanLipi', sans-serif",
            }}
          >
            <p className="text-[15px] text-gray-800 leading-relaxed">
              🚧 এই প্ল্যাটফর্মটির ডেভেলপমেন্ট এখনো চলছে, সম্পূর্ণ শেষ হয়নি।
            </p>

            <p className="text-[14px] text-gray-600 leading-relaxed">
              এখানে যে তথ্যগুলো দেখানো হচ্ছে (যেমন ডোনারের নাম, রক্তের গ্রুপ
              ইত্যাদি), সেগুলো সবই পরীক্ষার জন্য ব্যবহার করা হয়েছে।
            </p>

            <p className="text-[14px] text-gray-600 leading-relaxed">
              এগুলো কোনো আসল মানুষের তথ্য না।
            </p>
          </div>

          {/* English sub-note */}
          <p className="text-[11.5px] text-gray-400 leading-relaxed text-center">
            This platform uses simulated data for development purposes only.
            <br />
            No real user data is stored or displayed.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={handleClose}
            className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-rose-100"
            style={{
              fontFamily: "'Hind Siliguri', 'SolaimanLipi', sans-serif",
            }}
          >
            বুঝেছি, চালিয়ে যান →
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.22s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
