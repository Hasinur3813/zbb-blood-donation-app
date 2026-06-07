import { z } from "zod";

export const step1Schema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientAge: z.string().min(1, "Age is required"),
  patientGender: z.enum(["male", "female", "other"], {
    message: "Select gender",
  }),
  patientCondition: z.string().min(10, "Please describe the condition briefly"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], {
    message: "Select a blood group",
  }),
  unitsRequired: z.string().min(1, "Specify units required"),
  componentType: z.enum(["whole_blood", "platelets", "plasma", "red_cells"], {
    message: "Select component type",
  }),
});

export const step2Schema = z.object({
  hospital: z.string().min(3, "Hospital name is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().optional(),
  doctorName: z.string().min(2, "Doctor name is required"),
  doctorContact: z.string().optional(),
});

export const step3Schema = z.object({
  urgencyLevel: z.enum(["normal", "urgent", "emergency"], {
    message: "Select urgency level",
  }),
  requiredBy: z.string().min(1, "Required date/time is needed"),
  requiredByTime: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export const step4Schema = z.object({
  requesterName: z.string().min(2, "Your name is required"),
  relation: z.string().min(1, "Relation to patient is required"),
  contactPhone: z.string().min(11, "Valid phone number is required"),
  alternatePhone: z.string().optional(),
  contactEmail: z
    .string()
    .email("Valid email required")
    .optional()
    .or(z.literal("")),
  agreedToGuidelines: z
    .boolean()
    .refine((v) => v === true, "You must agree to guidelines"),
});

export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);
