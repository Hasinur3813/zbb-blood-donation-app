import { MapPin, Clock } from "lucide-react";
import { getTimeAgo } from "@/lib/timeAgo";
import { Request } from "@/types/Request";

const urgencyStyles: Record<Request["urgency"], string> = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  NORMAL: "bg-green-100! text-green-700!",
};

interface Props {
  request: Request;
}

export default function RequestCard({ request }: Props) {
  return (
    <div className="bg-white  rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-100">
      {/* Top */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xl font-bold text-red-600">
          {request.bloodGroup}
        </span>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            urgencyStyles[request.urgency]
          }`}
        >
          {request.urgency}
        </span>
      </div>

      {/* Hospital */}
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {request.hospitalName}
      </h3>

      {/* Location */}
      <div className="flex items-center text-sm text-slate-500 mb-3 gap-1">
        <MapPin className="w-4 h-4" />
        {request.city}
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {request.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {getTimeAgo(request.createdAt)}
        </div>

        <button className="text-red-600 cursor-pointer font-semibold hover:underline">
          Donate →
        </button>
      </div>
    </div>
  );
}
