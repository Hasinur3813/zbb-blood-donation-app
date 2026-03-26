"use client";

import Link from "next/link";
import { Heart, PlusCircle } from "lucide-react";
import Button from "../ui/Button/Button";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-linear-to-b from-white to-rose-50">
      <div className="container px-4 mx-auto">
        <div className="relative bg-rose-600 rounded-[3rem] p-10 md:p-20 text-center text-white overflow-hidden shadow-2xl shadow-rose-200">
          {/* Content */}
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold max-w-4xl mx-auto leading-tight tracking-tight">
              Ready to Become a Life-Saving Hero Today?
            </h2>

            <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
              Whether you want to donate or you're looking for help, we bridge
              the gap between donors and patients. Join thousands making an
              impact.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/register">
                <Button
                  variant="white"
                  size="lg"
                  className="gap-2 rounded-2xl shadow-xl"
                >
                  <Heart className="w-5 h-5 fill-rose-600" />
                  Register as Donor
                </Button>
              </Link>

              <Link href="/request">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-slate-900 border border-slate-700 w-full sm:w-auto h-16 rounded-2xl shadow-xl flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Post Blood Request
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorations */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-md h-112 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

          {/* Subtle grid overlay (premium touch) */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff33_1px,transparent_1px),linear-gradient(to_bottom,#ffffff33_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
      </div>
    </section>
  );
}
