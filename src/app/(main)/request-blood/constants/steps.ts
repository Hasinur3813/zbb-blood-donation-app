import { User, Building2, Zap, Phone } from "lucide-react";

export const STEPS = [
  { id: 1, label: "Patient", icon: User },
  { id: 2, label: "Hospital", icon: Building2 },
  { id: 3, label: "Urgency", icon: Zap },
  { id: 4, label: "Contact", icon: Phone },
];

export const STEP_FIELDS: Record<number, string[]> = {
  1: [
    "patientName",
    "patientAge",
    "patientGender",
    "patientCondition",
    "bloodGroup",
    "unitsRequired",
    "componentType",
  ],
  2: ["hospital", "division", "district", "doctorName"],
  3: ["urgencyLevel", "requiredBy"],
  4: ["requesterName", "relation", "contactPhone", "agreedToGuidelines"],
};

export const RELATIONS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Relative",
  "Friend",
  "Hospital Staff",
  "Other",
];
