import Link from "next/link";
import {
  Search,
  MapPin,
  Droplet,
  Heart,
  Clock,
  PhoneCall,
  ArrowRight,
  Activity,
  ShieldCheck,
  Users,
  Shield,
} from "lucide-react";
import DonorCard from "@/components/ui/DonorCard/DonorCard";
import RequestCard from "@/components/ui/RequestCard/RequestCard";
import HowItWorks from "@/components/HomePage/HowItWorks";
import ImpactSection from "@/components/HomePage/ImpactSection";
import CTA from "@/components/HomePage/CTA";
import EmergencyRequests from "@/components/EmergencyRequest";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-28 md:pt-32 md:pb-40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.1]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Activity className="h-4 w-4" />
              <span>Save lives today</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight text-balance">
              Donate Blood, <br className="hidden md:block" />
              <span className="text-primary relative">
                Give the Gift of Life
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 -rotate-1"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto text-balance">
              Vital Flow is a modern, editorial-inspired blood donation network.
              We connect local heroes with critical needs through a seamless,
              pulse-driven interface.
            </p>

            {/* Trust Badges */}
            <div className="flex justify-center items-center gap-6  mb-10">
              {[
                {
                  icon: Shield,
                  label: "Verified Donors",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Activity,
                  label: "24/7 Support",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  icon: Heart,
                  label: "Safe & Secure",
                  color: "text-rose-600",
                  bg: "bg-rose-50",
                },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  <div className={`${badge.bg} p-2 rounded-lg`}>
                    <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register-donor"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                <Heart className="h-5 w-5 fill-current" />
                Become a Donor
              </Link>
              <Link
                href="/request-blood"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-foreground border border-border rounded-lg font-semibold hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-center"
              >
                Request Blood
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section - overlapping with hero */}
      <section className="relative z-20 -mt-16 mb-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 max-w-4xl mx-auto border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Find Blood Donors Nearby
            </h2>
            <form
              className="flex flex-col md:flex-row gap-4"
              action="/donors"
              method="GET"
            >
              <div className="flex-1 relative">
                <select
                  name="group"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-medium h-12"
                >
                  <option value="">Any Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <Droplet className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  name="location"
                  placeholder="City or Location..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-muted-foreground font-medium h-12"
                />
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>

              <button
                type="submit"
                className="md:w-32 px-6 py-3 bg-foreground text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors h-12"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How it Works */}

      <HowItWorks />

      {/* Emergency Request Highlight */}
      <section className="py-8 bg-red-50 border-y border-red-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
              <div className="rounded-full bg-primary p-3 relative shadow-md shadow-red-200">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Emergency Requests
              </h3>
              <p className="text-sm text-slate-600">
                3 urgent patients need B+ and O- blood in your city.
              </p>
            </div>
          </div>
          <Link
            href="/donors?urgency=high"
            className="shrink-0 flex items-center gap-2 text-primary font-semibold hover:text-red-700 transition-colors bg-white px-5 py-2.5 rounded-full border border-red-100 shadow-sm"
          >
            View Urgent Calls
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Urgent Requests Section */}
      {/* <EmergencyRequests
        requests={[
          {
            id: 1,
            name: "Sarah Jenkins",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            verified: true,
            role: "Doctor",
            hospital: "St. Jude's Medical Center, Chicago",
            bloodGroup: "O-",
            urgency: "Emergency",
            requiredBy: "Today, 4:00 PM",
            units: 3,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            message:
              "Patient is undergoing emergency surgery after a severe accident. Universal O- donor blood is critically and desperately needed as soon as possible.",
          },
          {
            id: 2,
            name: "Marcus Thorne",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            verified: false,
            role: "Patient Relative",
            hospital: "Mercy General Hospital, Denver",
            bloodGroup: "A+",
            urgency: "Urgent",
            requiredBy: "June 18, 2024",
            units: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            message:
              "Requires blood for an upcoming cardiac operation. Please denote 'For Marcus Thorne' if you are available this week.",
          },
          {
            id: 3,
            name: "Elena Rossi",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            verified: true,
            role: "Nurse",
            hospital: "Pacific Star Clinic, Seattle",
            bloodGroup: "B-",
            urgency: "Normal",
            requiredBy: "June 21, 2024",
            units: 1,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            message:
              "Scheduled for ongoing anemia treatment. A single pint would greatly help replenish her reserves for the month.",
          },
        ]}
      /> */}
      {/* Available donors */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-widest mb-3">
                <Users className="w-4 h-4" /> Lifesavers in your community
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">
                Active Local Donors
              </h2>
              <p className="text-slate-500 font-medium max-w-lg">
                Meet our verified donors who are ready to respond to
                emergencies. Check their current eligibility and contact them
                instantly.
              </p>
            </div>
            <a
              href="#/find-donor"
              className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:border-red-600 hover:text-red-600 transition-all flex items-center gap-2"
            >
              Browse All Donors <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: "Hasinur Rahman",
                bloodGroup: "O+",
                city: "Kushtia",
                lastDonatedAt: "2025-11-20",
                totalDonations: 15,
              },
              {
                id: 23,
                name: "Sarah Ahmed",
                bloodGroup: "A+",
                city: "Dhaka",
                lastDonatedAt: "2026-02-15",
                totalDonations: 6,
              },
              {
                id: 2,
                name: "Rana Ahmed",
                bloodGroup: "AB+",
                city: "Pabna",
                lastDonatedAt: "2026-02-10",
                totalDonations: 20,
              },
              {
                id: 3,
                name: "Sonia Akter",
                bloodGroup: "B-",
                city: "Pabna",
                lastDonatedAt: "2025-09-10",
                totalDonations: 15,
              },
            ].map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Real Heroes, Real Stories
            </h2>
            <p className="text-muted-foreground">
              Hear from patients whose lives were saved by generous donors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Jenkins",
                role: "Patient Family",
                text: "When my father needed emergency surgery, VitalFlow helped us find donors within hours. We are forever grateful.",
              },
              {
                name: "Michael T.",
                role: "Regular Donor",
                text: "The process is incredibly smooth. I love getting updates when my blood is actually used to help someone. It's the best feeling.",
              },
              {
                name: "Dr. Emily Chen",
                role: "City Hospital",
                text: "As a clinician, having a reliable platform to source specific blood groups during severe traumas is absolutely invaluable.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <ImpactSection />
      <CTA />
    </div>
  );
}
