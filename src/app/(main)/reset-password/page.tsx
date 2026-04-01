"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  const {
    resetPassword,
    isLoading,
    error,
    passwordResetSuccessful,
    resetMessage,
    clearPasswordReset,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    clearPasswordReset();
  }, [clearPasswordReset]);

  useEffect(() => {
    if (passwordResetSuccessful) {
      router.push("/login");
    }
  }, [passwordResetSuccessful, router]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      return;
    }

    await resetPassword({ token, password: data.password });
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h2 className="text-3xl font-extrabold">Choose a new password</h2>
        <p className="text-slate-500">
          Your token: {token || "(missing token)"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-2xl shadow-xl border border-slate-100">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {resetMessage && !error && (
            <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">
              {resetMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type="password"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-red-500" : "border-slate-200"}`}
                  placeholder="Enter new password"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary/20 ${errors.confirmPassword ? "border-red-500" : "border-slate-200"}`}
                  placeholder="Confirm new password"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold transition disabled:opacity-70"
            >
              {isLoading ? "Updating..." : "Reset password"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-slate-500">
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
