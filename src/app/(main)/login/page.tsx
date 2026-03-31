"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser } from "@/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeartPulse, ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormValues,
    e?: React.BaseSyntheticEvent,
  ) => {
    e?.preventDefault();

    try {
      const resultAction = await dispatch(
        loginUser({ email: data.email, password: data.password }),
      );

      if (loginUser.fulfilled.match(resultAction)) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <HeartPulse className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-slate-500 font-medium">
          Sign in to manage your donations or requests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary/50 via-primary to-primary/80"></div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
          >
            {authError && (
              <p className="text-red-500 text-sm font-medium text-center">
                {authError}
              </p>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 hover:border-slate-300 ${errors.email ? "border-red-500" : "border-slate-200"}`}
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 hover:border-slate-300 ${errors.password ? "border-red-500" : "border-slate-200"}`}
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to VitalFlow
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500">
              Not a donor yet?{" "}
              <Link
                href="/register-donor"
                className="font-bold text-primary hover:underline"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
