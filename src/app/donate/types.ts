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
  id: number;
  name: string;
  avatar: string | null;
  verified: boolean;
  role: string;
  hospital: string;
  bloodGroup: BloodGroup;
  urgency: Urgency;
  requiredBy: string;
  units: number;
  createdAt: string;
  message: string;
}
