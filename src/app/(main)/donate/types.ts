export type Urgency = "Emergency" | "Urgent" | "Normal";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface BloodRequest {
  _id: string;
  requestNumber: string;
  requesterId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
  };
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientCondition: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  componentType: "whole_blood" | "platelets" | "plasma" | "red_cells";
  hospital: string;
  division: string;
  district: string;
  ward?: string;
  doctorName: string;
  doctorContact?: string;
  urgencyLevel: "normal" | "urgent" | "emergency";
  requiredBy: string;
  requiredByTime?: string;
  specialInstructions?: string;
  requesterName: string;
  relation: string;
  contactPhone: string;
  alternatePhone?: string;
  contactEmail?: string;
  status: "pending" | "matched" | "completed" | "cancelled" | "expired";
  matchedDonorId?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
