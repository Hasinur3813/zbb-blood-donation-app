import { z } from "zod";
import { fullSchema } from "@/app/(main)/request-blood/constants/schemas";

export type FormValues = z.infer<typeof fullSchema>;
export type UrgencyLevel = FormValues["urgencyLevel"];
export type ComponentType = FormValues["componentType"];
export type BloodGroup = FormValues["bloodGroup"];
