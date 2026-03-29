import { BloodGroup, Urgency, BloodRequest } from "./types";

export const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
export const URGENCIES: Urgency[] = ["Emergency", "Urgent", "Normal"];

export const ITEMS_PER_PAGE = 5;

export const urgencyConfig: Record<
  Urgency,
  {
    badge: string;
    text: string;
    dot?: string;
    blood: string;
    bloodText: string;
  }
> = {
  Emergency: {
    badge: "bg-rose-50 text-rose-600 border border-rose-100",
    text: "text-rose-600",
    dot: "bg-rose-500 animate-ping",
    blood: "bg-rose-50",
    bloodText: "text-rose-600",
  },
  Urgent: {
    badge: "bg-amber-50 text-amber-600 border border-amber-100",
    text: "text-amber-600",
    blood: "bg-amber-50",
    bloodText: "text-amber-600",
  },
  Normal: {
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    text: "text-emerald-600",
    blood: "bg-emerald-50",
    bloodText: "text-emerald-600",
  },
};

export const REQUESTS: BloodRequest[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    role: "Doctor",
    hospital: "St. Jude's Medical Center, Chicago",
    bloodGroup: "O-",
    urgency: "Emergency",
    requiredBy: "Today, 4:00 PM",
    units: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    message:
      "Patient is undergoing emergency surgery after a severe accident. Universal O- donor blood is critically and desperately needed as soon as possible.",
    contactPhone: "+12025550199",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: false,
    role: "Patient Relative",
    hospital: "Mercy General Hospital, Denver",
    bloodGroup: "A+",
    urgency: "Urgent",
    requiredBy: "June 18, 2024",
    units: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    message:
      "Requires blood for an upcoming cardiac operation. Please denote 'For Marcus Thorne' if you are available this week.",
    contactPhone: "+13035550177",
  },
  {
    id: 3,
    name: "Elena Rossi",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    verified: true,
    role: "Nurse",
    hospital: "Pacific Star Clinic, Seattle",
    bloodGroup: "B-",
    urgency: "Normal",
    requiredBy: "June 21, 2024",
    units: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    message:
      "Scheduled for ongoing anemia treatment. A single pint would greatly help replenish her reserves for the month.",
    contactPhone: "+12065550188",
  },
  {
    id: 4,
    name: "D. Thompson",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    verified: true,
    role: "Emergency Staff",
    hospital: "Metropolitan Health, NYC",
    bloodGroup: "AB+",
    urgency: "Emergency",
    requiredBy: "Within 2 Hours",
    units: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    message:
      "Severe internal bleeding, multiple transfusions needed immediately! Any AB+ donor nearby please hurry.",
    contactPhone: "+12125550144",
  },
  {
    id: 5,
    name: "L. Garcia",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    verified: false,
    role: "Hospital Staff",
    hospital: "Austin Community Hospital",
    bloodGroup: "O+",
    urgency: "Urgent",
    requiredBy: "June 19, 2024",
    units: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    message:
      "Preparing for a complex organ transplant. O+ donors are warmly requested to assist with blood matching.",
    contactPhone: "+15125550122",
  },
];
