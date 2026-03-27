export type UrgencyLevel = "CRITICAL" | "HIGH" | "NORMAL";

export interface Request {
  id: number;
  bloodGroup: string;
  hospitalName: string;
  city: string;
  description: string;
  createdAt: string;
  urgency: UrgencyLevel;
}
