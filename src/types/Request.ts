export type UrgencyLevel = "Emergency" | "Urgent" | "Normal";

export interface Request {
  id: number;
  name: string;
  avatar: string;
  verified: boolean;
  role: string;
  hospital: string;
  bloodGroup: string;
  urgency: UrgencyLevel;
  requiredBy: string;
  units: number;
  createdAt: string;
  message: string;
}
