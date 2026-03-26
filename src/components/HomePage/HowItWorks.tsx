"use client";

import { UserPlus, CalendarCheck, HeartHandshake } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      icon: UserPlus,
      title: "Register",
      description:
        "Create your donor profile in minutes. Add health details and become part of a trusted donor network.",
    },
    {
      id: "02",
      icon: CalendarCheck,
      title: "Schedule",
      description:
        "Pick a convenient time and nearby location. Our smart system adapts to your availability.",
    },
    {
      id: "03",
      icon: HeartHandshake,
      title: "Save a Life",
      description:
        "Donate safely with guidance. One donation can save multiple lives and make a real impact.",
    },
  ];

  return (
    <section className="relative mb-10 bg-linear-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            How it works
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Simple, fast, and impactful. Become a donor and help save lives in
            just a few steps.
          </p>
          <div className="h-1 w-20 bg-red-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-red-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-slate-800 mb-3">
                  {step.title}
                </h4>

                <p className="text-slate-500 leading-relaxed text-sm">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="absolute top-6 right-6 text-6xl font-black text-slate-100 group-hover:text-red-100 transition">
                  {step.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
