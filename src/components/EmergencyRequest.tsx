"use client";

import { ArrowRight } from "lucide-react";
import RequestCard from "@/app/(main)/donate/components/RequestCard";
import { BloodRequest } from "@/app/(main)/donate/types";

interface Props {
  requests: BloodRequest[];
}

export default function EmergencyRequests({ requests }: Props) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Emergency Requests
            </h2>
            <p className="text-slate-500 font-medium">
              People needing your help right now in your city.
            </p>
          </div>

          <a
            href="/requests"
            className="text-red-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            View All Requests <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
