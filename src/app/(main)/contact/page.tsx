"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button/Button";

// ── Schema ────────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.enum(
    [
      "General Inquiry",
      "Donation Question",
      "Technical Support",
      "Partnership",
    ],
    { message: "Please select a subject" },
  ),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ── Static data ───────────────────────────────────────────────────────────────

const contactDetails = [
  {
    icon: <Phone className="text-rose-600 w-5 h-5" />,
    bg: "bg-rose-50",
    label: "Call Us",
    primary: "+1 (555) 800-FLOW",
    secondary: "Mon–Fri, 9am – 6pm EST",
  },
  {
    icon: <Mail className="text-sky-600 w-5 h-5" />,
    bg: "bg-sky-50",
    label: "Email Support",
    primary: "hello@vitalflow.org",
    secondary: "Response within 24 hours",
  },
  {
    icon: <MapPin className="text-emerald-600 w-5 h-5" />,
    bg: "bg-emerald-50",
    label: "Visit Headquarters",
    primary: "242 Heartbeat Lane",
    secondary: "Medical District, NY 10012",
  },
];

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputBase =
  "w-full bg-gray-100 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3.5 text-base border border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:bg-white focus:border-rose-200 transition-all";

const inputError =
  "border-rose-300 bg-rose-50 focus:ring-rose-400/30 focus:border-rose-400";

const labelClass = "block text-sm font-semibold text-gray-600 mb-1.5 ml-0.5";

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="mt-1.5 ml-0.5 text-xs font-medium text-rose-500">{msg}</p>
  ) : null;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "General Inquiry" },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Replace with your actual API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log(data);
    reset();
  };

  return (
    <main className="grow pt-10 pb-20  bg-white text-gray-900">
      <div className="container px-4 mx-auto">
        {/* Hero Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-5 max-w-3xl leading-[1.1]">
            Connect with the <span className="text-rose-600 italic">Pulse</span>{" "}
            of Humanity.
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
            Whether you have questions about donation, need urgent assistance,
            or want to partner with us, our team is here to support your journey
            in saving lives.
          </p>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Send a Message
            </h2>

            {isSubmitSuccessful && (
              <div className="mb-6 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    {...register("fullName")}
                    className={`${inputBase} ${errors.fullName ? inputError : ""}`}
                    placeholder="John Doe"
                    type="text"
                  />
                  <ErrorMsg msg={errors.fullName?.message} />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    {...register("email")}
                    className={`${inputBase} ${errors.email ? inputError : ""}`}
                    placeholder="john@example.com"
                    type="email"
                  />
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className={labelClass}>Subject</label>
                <select
                  {...register("subject")}
                  className={`${inputBase} ${errors.subject ? inputError : ""}`}
                >
                  <option>General Inquiry</option>
                  <option>Donation Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
                <ErrorMsg msg={errors.subject?.message} />
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  {...register("message")}
                  className={`${inputBase} ${errors.message ? inputError : ""}`}
                  placeholder="How can we help you today?"
                  rows={5}
                />
                <ErrorMsg msg={errors.message?.message} />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Cards */}
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-7">
              {contactDetails.map(({ icon, bg, label, primary, secondary }) => (
                <div key={label} className="flex items-start gap-5">
                  <div
                    className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center shrink-0`}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                      {label}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{primary}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{secondary}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="relative h-64 md:h-72 w-full rounded-3xl overflow-hidden group">
              <img
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZguXrM7fxtKjv3cylJ_p1gzQVZeRrDeOGt-mm5X6HB35AmmZyEG2Tiig2ghtbtaesliJTyiNUFgh0SHrb7yFVLX8ANbbwhJ0HZyGmTsJLrOGx2ykKP3M5TKAIVOCSrk-KqFNe4pYuDhSe_F01fJL9tFwPm7m8L2sVDaBsK2Ofz_9Ev8ek7xDVZJ5-7z2dTKrT75gIC6u4mXcQdiFKGaj44qVjHCVT761RhzOslXHNj38Ipk14Xi8TnRkNmCjBXQGIaYbmwR5CQBw"
                alt="Map of New York City"
              />
              <div className="absolute inset-0 bg-rose-600/10 mix-blend-multiply pointer-events-none" />
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-bold tracking-wide uppercase text-gray-700">
                  Vital Flow HQ — NY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
