"use client";

import Image from "next/image";
import { Quote } from "lucide-react";

export default function ImpactSection() {
  return (
    <section className="bg-slate-50 py-24 px-6 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-12">
            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                Real Impact. <br /> Real Stories.
              </h2>
              <p className="text-slate-500 text-lg max-w-md">
                Hear from people whose lives were transformed by the simple act
                of a stranger’s kindness.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="relative bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition">
              {/* Quote Icon */}
              <Quote className="absolute -top-4 -left-4 w-16 h-16 text-red-100" />

              {/* Text */}
              <p className="italic text-lg text-slate-700 leading-relaxed relative z-10">
                &quot;The platform helped us find a donor within 40 minutes for
                my father’s surgery. I’ll forever be grateful for this
                life-saving network.&quot;
              </p>

              {/* User */}
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 relative">
                  <Image
                    src="https://ui-avatars.com/api/?name=Elena+Rodriguez"
                    alt="User"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <p className="font-bold text-slate-800">Elena Rodriguez</p>
                  <p className="text-sm text-slate-500">Patient Advocate</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Stats Bento Grid) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6 mt-12">
              {/* Card 1 */}
              <div className="bg-red-600 text-white p-8 rounded-3xl shadow-md">
                <div className="text-4xl font-extrabold">150+</div>
                <p className="text-white/80 text-sm uppercase mt-2 tracking-widest">
                  Active Clinics
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-4xl font-extrabold text-slate-900">
                  5,200
                </div>
                <p className="text-slate-500 text-sm uppercase mt-2 tracking-widest">
                  Weekly Units
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Card 3 */}
              <div className="bg-emerald-100 p-8 rounded-3xl">
                <div className="text-4xl font-extrabold text-emerald-700">
                  98%
                </div>
                <p className="text-emerald-600 text-sm uppercase mt-2 tracking-widest">
                  Success Rate
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-indigo-100 p-8 rounded-3xl">
                <div className="text-4xl font-extrabold text-indigo-700">
                  12M
                </div>
                <p className="text-indigo-600 text-sm uppercase mt-2 tracking-widest">
                  Lives Touched
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
