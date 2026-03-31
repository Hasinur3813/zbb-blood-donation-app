"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading, error, resetMessage } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotPasswordForm) => {
    await requestPasswordReset({ email: data.email });
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h2 className="text-3xl font-extrabold">Reset your password</h2>
        <p className="text-slate-500">
          Enter your email to receive a reset link.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-2xl shadow-xl border border-slate-100">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {resetMessage && (
            <div className="mb-4 text-green-700 bg-green-50 p-3 rounded-md">
              {resetMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-red-500" : "border-slate-200"}`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold transition disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Send reset link"}
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
