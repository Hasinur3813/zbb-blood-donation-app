"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Droplet, AlertCircle, CheckCircle2 } from "lucide-react";

const requestBloodSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  bloodGroup: z.string().min(1, "Please select a blood group"),
  location: z.string().min(5, "Please enter a specific hospital/city location"),
  urgencyLevel: z.enum(["low", "medium", "critical"]),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  additionalNotes: z.string().optional(),
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
      urgencyLevel: "medium",
    },
  });

  const onSubmit = async (data: RequestBloodFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Submitted:", data);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-primary/5 px-8 py-6 border-b border-primary/10">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Droplet className="h-6 w-6 text-primary fill-primary" />
              Request Blood
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill out this form to broadcast an emergency or scheduled blood request to donors in your area.
            </p>
          </div>

          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully</h2>
                <p className="text-slate-600 mb-8">
                  Your blood request has been broadcasted to local donors matching the required group. You will be contacted shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 bg-slate-100 text-slate-800 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Patient Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                    <input 
                      {...register("patientName")}
                      className={`w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.patientName ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="e.g. John Doe"
                    />
                    {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group Needed</label>
                      <select 
                        {...register("bloodGroup")}
                        className={`w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.bloodGroup ? 'border-red-500' : 'border-slate-200'}`}
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
                      {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Urgency Level</label>
                      <select 
                        {...register("urgencyLevel")}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option value="low">Low (Next 48 Hours)</option>
                        <option value="medium">Medium (Next 24 Hours)</option>
                        <option value="critical">Critical (Immediate)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hospital / Location</label>
                    <input 
                      {...register("location")}
                      className={`w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.location ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="e.g. City General Hospital, Ward 3"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                    <input 
                      {...register("contactPhone")}
                      type="tel"
                      className={`w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.contactPhone ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="Your mobile number"
                    />
                    {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                    <textarea 
                      {...register("additionalNotes")}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Any specific medical requirements or instructions..."
                    />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    By submitting this request, you agree to our terms. False or spam requests may lead to permanent account suspension. Please ensure all details are accurate.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Broadcasting...
                    </>
                  ) : (
                    "Submit Blood Request"
                  )}
                </button>

              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
