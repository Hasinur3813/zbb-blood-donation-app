"use client";

import { MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

// {
//     id: 3,
//     bloodGroup: "B+",
//     hospitalName: "Rajshahi Hospital",
//     city: "Rajshahi",
//     description: "Scheduled transfusion for a patient with anemia.",
//     createdAt: "2026-03-18",
//     urgency: "NORMAL",
//   },

type Request = {
  id?: string | number;
  bloodGroup: string;
  hospitalName: string;
  city: string;
  description: string;
  createdAt: string; // ISO date
  urgency: string;
};

type Props = {
  request: Request;
};

const urgencyStyles: Record<Request["urgency"], string> = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  NORMAL: "bg-yellow-100 text-yellow-700",
};

export default function RequestCard({ request }: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-bold text-xl border border-red-100">
            {request.bloodGroup}
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{request.hospitalName}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {request.city}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full ${urgencyStyles[request.urgency]}`}
        >
          {request.urgency}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
        {request.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3 h-3" />{" "}
          {new Date(request.createdAt).toLocaleDateString()}
        </div>
        <Link
          href={`/donate/${request.id ?? ""}`}
          className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all"
        >
          Donate Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
