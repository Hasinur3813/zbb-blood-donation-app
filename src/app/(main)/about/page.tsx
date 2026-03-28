"use client";

import { Heart, Eye, Activity, Ambulance, Users } from "lucide-react";
import Button from "@/components/ui/Button/Button";

export default function About() {
  return (
    <main className=" pb-20 bg-white text-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-10 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 font-semibold text-sm tracking-widest uppercase">
            Our Story
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Healing starts with a{" "}
            <span className="text-red-600">single pulse.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
            Vital Flow was born from a simple realization: the distance between
            a patient in need and a life-saving donor should be zero. We are
            reimagining the humanitarian landscape through intentional design
            and human connection.
          </p>
        </div>
        <div className="relative">
          <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASioqcR0nBxC3QGhwQaqLhPOrGeBc21YJUiP0x887M4puz7Jc-HNVctnRLNj3jwFFph6m-qv3AOVCaFfT8L6Zvlwb3Ni2kPs-h5nRaEbqRTeGlRO9lPetxb-Rgh1wnOSGfW1DAJhGnKrcT_KhObk1zBsAZZ0iJpc4T3YdjGgI7yREAHCRJS9IcpTleJBusxLlWlz5hfPlA2OY4IBWeoO3Wt9d0jcRse6klLK0UvPkBBVZMrUnZ1yztl0LdGqj-X8qbRKK5JWRabH8"
              alt="Artistic hand close-up"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg max-w-xs border border-gray-100">
            <p className="text-4xl font-black text-red-600 mb-0.5">12k+</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Lives Impacted Monthly
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Mission */}
            <div className="md:col-span-7 bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <Heart className="text-red-500 w-8 h-8" />
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  To democratize access to safe blood supplies by building the
                  world's most intuitive, reliable, and community-driven
                  donation network. We believe that every pulse matters and no
                  life should be lost due to a lack of supply.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="md:col-span-5 bg-red-600 p-10 rounded-3xl shadow-sm text-white flex flex-col justify-between gap-6 relative overflow-hidden">
              <Eye className="text-white/80 w-8 h-8" />
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-base text-white/85 leading-relaxed">
                  A world where geographical and logistical barriers to
                  healthcare are dissolved by the power of collective human
                  empathy.
                </p>
              </div>
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Why Your Donation Matters
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            One donation can save up to three lives. The impact ripples through
            families, communities, and generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Ambulance className="text-red-600 w-7 h-7" />,
              title: "Critical Response",
              body: "In emergencies and surgical procedures, blood is the most critical resource. Having a steady supply ensures hospitals can act instantly.",
            },
            {
              icon: <Activity className="text-red-600 w-7 h-7" />,
              title: "Chronic Care",
              body: "Patients with conditions like thalassemia or sickle cell anemia require regular transfusions to maintain their quality of life.",
            },
            {
              icon: <Users className="text-red-600 w-7 h-7" />,
              title: "Community Health",
              body: "A robust donor network is the backbone of a resilient healthcare system, protecting everyone from unexpected crises.",
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-gray-500 leading-relaxed text-base">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="bg-gray-50 py-20 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr4tEDFj42CKDId_kdV8CTzlvWLIAwVxqhnXWuHs6L7j8z6mrvT2nipthn3xh44EiuhglfHit3jS3FXLUayZxbI6brhoMbwQp9wB3QO3-KmXojqUogn0hUWTmIJ_lMAEiPQjSLcniRZgxl23i9ExAYDFA284lj8ktgI3f10olPLibvZ6HcazCG2CgjBAObnkDX2R_qy9Jf5d43xnY_BPmhCAaCCz6r8DCLBwUU_lTw991xdMY3IChb9l2PI5GMt9yrBXbKn-ddpoU"
                alt="Dr. Elena Rodriguez"
              />
            </div>
            <div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-snug mb-5 italic">
                "Vital Flow isn't just about technology; it's about the
                heartbeat of our society. We're building a bridge made of
                courage and kindness."
              </blockquote>
              <cite className="not-italic">
                <span className="font-bold text-gray-900 block text-base">
                  Dr. Elena Rodriguez
                </span>
                <span className="text-gray-400 text-sm">
                  Chief Medical Officer
                </span>
              </cite>
            </div>
          </div>
        </div>
        <span className="absolute top-0 right-0 text-[18rem] font-black text-gray-900/4 select-none leading-none -translate-y-1/4 translate-x-1/4 pointer-events-none">
          "
        </span>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-red-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Ready to join the pulse of life?
            </h2>
            <p className="text-lg text-white/85 leading-relaxed">
              Your journey as a donor starts with a simple step. Join thousands
              of others making a difference today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button variant="white" size="lg">
                Register as Donor
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-white hover:bg-black/70 active:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </main>
  );
}
