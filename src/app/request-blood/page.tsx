"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ShieldCheck,
  Activity,
  MapPin,
  Send,
} from "lucide-react";
import DonorMapSection from "./components/donorMapSection";

const requestBloodSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  bloodGroup: z.string().min(1, "Please select a blood group"),
  location: z.string().min(5, "Please enter a specific hospital/city location"),
  urgencyLevel: z.enum(["normal", "urgent", "emergency"]),
  contactPhone: z.string().min(10, "Valid phone number is required"),
});

type RequestBloodFormValues = z.infer<typeof requestBloodSchema>;

export default function RequestBloodPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestBloodFormValues>({
    resolver: zodResolver(requestBloodSchema),
    defaultValues: {
      urgencyLevel: "emergency",
    },
  });

  const onSubmit = async (data: RequestBloodFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Submitted:", data);
    setIsSubmitted(true);
  };

  return (
    <>
      <main className="grow pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Content & Instructions */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4">
              Urgent Assistance
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
              Every second <br />
              is a <span className="text-primary italic">heartbeat</span>.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-md">
              Submit your request to our verified donor network. We connect you
              with local heroes ready to provide the gift of life in your moment
              of need.
            </p>
            {/* Status Cards (Editorial Layout) */}
            <div className="space-y-6">
              <div className="bg-[#eeeef0] p-6 rounded-xl flex items-start gap-4 transition-all hover:bg-surface-container">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">
                    Verified Network
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Access to 10k+ pre-screened eligible donors.
                  </p>
                </div>
              </div>
              <div className="bg-[#eeeef0] p-6 rounded-xl flex items-start gap-4 transition-all hover:bg-surface-container">
                <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">
                    Rapid Response
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Alerts sent instantly to donors in your hospital vicinity.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: The Request Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-4xl shadow-sm  flex flex-col h-full justify-center">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-on-surface font-headline">
                    Request Submitted Successfully
                  </h2>
                  <p className="text-on-surface-variant mb-8">
                    Your blood request has been broadcasted to local donors
                    matching the required group. You will be contacted shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-[#f3f3f5] border border-outline-variant/15 text-on-surface font-semibold rounded-xl hover:bg-surface-container transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Patient Name */}
                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-on-surface-variant ml-1"
                        htmlFor="patient-name"
                      >
                        Patient Name
                      </label>
                      <input
                        {...register("patientName")}
                        className={`w-full px-5 py-4 bg-[#f3f3f5] border ${errors.patientName ? "border-red-400" : "border-transparent"} rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-on-surface transition-all`}
                        id="patient-name"
                        placeholder="Full legal name"
                        type="text"
                      />
                      {errors.patientName && (
                        <p className="text-red-500 text-xs ml-1 mt-1">
                          {errors.patientName.message}
                        </p>
                      )}
                    </div>
                    {/* Blood Group Needed */}
                    <div className="space-y-2">
                      <label
                        className="block text-sm font-semibold text-on-surface-variant ml-1"
                        htmlFor="blood-group"
                      >
                        Blood Group Needed
                      </label>
                      <select
                        {...register("bloodGroup")}
                        className={`w-full px-5 py-4 bg-[#f3f3f5] border ${errors.bloodGroup ? "border-red-400" : "border-transparent"} rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-on-surface appearance-none transition-all`}
                        id="blood-group"
                        defaultValue=""
                      >
                        <option disabled value="">
                          Select Group
                        </option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      {errors.bloodGroup && (
                        <p className="text-red-500 text-xs ml-1 mt-1">
                          {errors.bloodGroup.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Hospital Location */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold text-on-surface-variant ml-1"
                      htmlFor="hospital-location"
                    >
                      Hospital Location
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        {...register("location")}
                        className={`w-full pl-12 pr-5 py-4 bg-[#f3f3f5] border ${errors.location ? "border-red-400" : "border-transparent"} rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-on-surface transition-all`}
                        id="hospital-location"
                        placeholder="City, Hospital Name, or Area"
                        type="text"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-xs ml-1 mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                  {/* Urgency Level */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="cursor-pointer group">
                        <input
                          className="hidden peer"
                          type="radio"
                          value="normal"
                          {...register("urgencyLevel")}
                        />
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f3f3f5] peer-checked:bg-slate-100 peer-checked:ring-2 peer-checked:ring-slate-300 transition-all font-medium text-slate-600 peer-checked:text-slate-900 shadow-sm hover:bg-slate-50">
                          <span className="text-sm">Normal</span>
                        </div>
                      </label>
                      <label className="cursor-pointer group">
                        <input
                          className="hidden peer"
                          type="radio"
                          value="urgent"
                          {...register("urgencyLevel")}
                        />
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-orange-50 peer-checked:bg-orange-100 peer-checked:ring-2 peer-checked:ring-orange-300 transition-all font-medium text-orange-600 peer-checked:text-orange-900 shadow-sm hover:bg-orange-100/70">
                          <span className="text-sm">Urgent</span>
                        </div>
                      </label>
                      <label className="cursor-pointer group">
                        <input
                          className="hidden peer"
                          type="radio"
                          value="emergency"
                          {...register("urgencyLevel")}
                        />
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-50 peer-checked:bg-red-100 peer-checked:ring-2 peer-checked:ring-red-400 transition-all font-bold text-red-600 peer-checked:text-red-900 shadow-sm hover:bg-red-100/70 relative overflow-hidden">
                          <span className="text-sm">Emergency</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold text-on-surface-variant ml-1"
                      htmlFor="contact-info"
                    >
                      Contact Info
                    </label>
                    <input
                      {...register("contactPhone")}
                      className={`w-full px-5 py-4 bg-[#f3f3f5] border ${errors.contactPhone ? "border-red-400" : "border-transparent"} rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-on-surface transition-all`}
                      id="contact-info"
                      placeholder="Phone Number / Emergency Contact"
                      type="tel"
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 text-xs ml-1 mt-1">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full signature-gradient bg-primary text-white py-5 rounded-2xl font-headline text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Broadcasting...
                        </>
                      ) : (
                        <>
                          Request Blood
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-on-surface-variant mt-6 italic">
                      By clicking, you agree to our Donor Privacy Guidelines and
                      urgent notification protocols.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Map Section (Asymmetric Editorial Element) */}
      <DonorMapSection />
    </>
  );
}
