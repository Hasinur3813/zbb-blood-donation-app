"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  Calendar,
  HeartPulse,
  CheckCircle2,
  ShieldAlert,
  Mail,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerUser } from "@/store/slices/authSlice";
import type { BloodGroup, Gender } from "@/types/donor";
// imports removed

const registerDonorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.string().min(1, "Please select your gender"),
  bloodGroup: z.string().min(1, "Please select a blood group"),
  phone: z.string().min(10, "Valid phone number is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  country: z.string().min(2, "Country is required"),
  lastDonation: z.string().optional(),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
});

type RegisterDonorFormValues = z.infer<typeof registerDonorSchema>;

export default function RegisterDonorPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDonorFormValues>({
    resolver: zodResolver(registerDonorSchema),
  });

  const onSubmit = async (data: RegisterDonorFormValues) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      bloodGroup: data.bloodGroup as BloodGroup,
      gender: data.gender as Gender,
      city: data.city,
      district: data.district,
      country: data.country,
      lastDonation: data.lastDonation ? new Date(data.lastDonation) : null,
      agreedToTerms: data.agreedToTerms,
    };

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      setIsRegistered(true);
      // Let the user see the success screen, or redirect.
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Left Decoration / Information Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-red-700/50 rounded-full blur-2xl z-0 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-4 h-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full font-semibold backdrop-blur-md mb-8"
          >
            <HeartPulse className="h-5 w-5 text-red-200" />
            VitalFlow
          </Link>

          <div className="mt-auto mb-16 max-w-md">
            <h1 className="text-4xl font-black mb-6 leading-tight">
              Your blood can save <br />
              <span className="text-red-200">up to three lives.</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Every 2 seconds, someone in the country needs blood. By
              registering as a donor, you are taking the first step to becoming
              a real-life hero.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-red-300 shrink-0" />
                <span>
                  Receive notifications only for emergencies perfectly matching
                  your profile.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-red-300 shrink-0" />
                <span>
                  Track your donation history and health impact seamlessly.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-red-300 shrink-0" />
                <span>Completely free to use, forever.</span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-red-200/60 mt-auto">
            &copy; {new Date().getFullYear()} VitalFlow Secure Registration
            Network
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 md:p-12 overflow-y-auto z-10">
        <div className="w-full max-w-xl bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 relative">
          {isRegistered ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-900">
                Registration Complete
              </h2>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Thank you for stepping up to save lives. You are now officially
                a registered donor on VitalFlow.
              </p>
              <Link
                href="/dashboard/user"
                className="inline-block w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform text-center mb-4"
              >
                Go to My Dashboard
              </Link>
              <Link
                href="/donors"
                className="inline-block w-full text-center text-slate-500 font-medium hover:text-slate-900 py-2 transition-colors fade-in"
              >
                Explore the Donor Network
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-slate-900 mb-3 flex items-center lg:justify-start justify-center gap-3 tracking-tight">
                  <UserPlus className="h-8 w-8 text-primary" />
                  Donor Registration
                </h2>
                <p className="text-slate-500 font-medium">
                  Please provide accurate details to help us match you during
                  emergencies.
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <p>{authError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    {...register("fullName")}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.fullName ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1.5 font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        className={`w-full px-4 py-3 pl-11 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.email ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                        placeholder="you@example.com"
                      />
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type="password"
                        className={`w-full px-4 py-3 pl-11 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.password ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none custom-select ${errors.gender ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      {...register("bloodGroup")}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 appearance-none custom-select ${errors.bloodGroup ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.bloodGroup.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.phone ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                      placeholder="+880 1xxxxxxxxx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      City
                    </label>
                    <input
                      {...register("city")}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.city ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                      placeholder="e.g. Dhaka"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      District
                    </label>
                    <input
                      {...register("district")}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.district ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                      placeholder="e.g. Dhaka"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Country
                    </label>
                    <input
                      {...register("country")}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 ${errors.country ? "border-red-500" : "border-slate-200 hover:border-slate-300"}`}
                      placeholder="e.g. Bangladesh"
                      defaultValue="Bangladesh"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Last Donation Date (Optional)
                  </label>
                  <div className="relative">
                    <input
                      {...register("lastDonation")}
                      type="date"
                      className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 hover:border-slate-300 appearance-none date-input-custom"
                    />
                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                    You must wait 90 days between whole blood donations.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-4 cursor-pointer group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors">
                    <div className="relative flex items-center justify-center pt-1 shrink-0">
                      <input
                        type="checkbox"
                        {...register("agreedToTerms")}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-white checked:border-primary checked:bg-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ring-offset-2 ring-offset-slate-50"
                      />
                      <svg
                        className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-600 leading-snug">
                      I confirm that I am over 18, weigh at least 50kg, and
                      agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline font-bold"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline font-bold"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                      {errors.agreedToTerms.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Registering...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>

                <p className="text-center text-sm font-medium text-slate-500 mt-6">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
