// data/dummyDonor.ts
import { Donor } from "@/types/donor";

export const dummyDonor: Donor = {
  // ── Identity
  id: "donor_001",
  name: "Alex Mercer",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBszC17M5Jb9qLVy1P9uX3a-wYsI5QltiNrE4jYs3m6y4Ce8mFO6yLTAtKI7qL61J0G2HmYMlVl_fsCcHrxbPst65aicIX9UAwAzhAr4rR00BjHdJZLyjEgCqUQbB1ufoPg7_ZCHOZHvWbMMAe3gFoik_YjFsOe2IxVKXV86vbL7O4m8WMMi6mG46W7U98o8IbmxA3VbARlySf9ynzVV-NYy9OMNveDGdFucVFAyr-9BwD697skNlxPVLsSTN6_B2ss2els9Snemy4",
  bloodGroup: "O-",
  verified: true,
  status: "Super Hero",

  // ── Contact
  phone: "+8801712345678",
  email: "alex.mercer@example.com",
  city: "Dhaka",
  district: "Dhaka",
  country: "Bangladesh",

  // ── Availability
  isAvailable: true,
  lastDonatedAt: "2024-08-24T10:30:00.000Z",
  nextEligibleAt: "2024-10-14T10:30:00.000Z",

  // ── Stats
  totalDonations: 9,
  livesImpacted: 12,
  totalLitersDoanted: 5.4,

  // ── Donation history
  donationHistory: [
    {
      id: "dh_001",
      location: "St. Jude Medical Center",
      type: "Whole Blood",
      date: "2024-08-24T10:30:00.000Z",
      status: "COMPLETED",
    },
    {
      id: "dh_002",
      location: "Community Blood Drive",
      type: "Platelets",
      date: "2024-05-12T09:00:00.000Z",
      status: "COMPLETED",
    },
    {
      id: "dh_003",
      location: "City Emergency Unit",
      type: "Whole Blood",
      date: "2024-01-05T14:00:00.000Z",
      status: "EXPIRED",
    },
    {
      id: "dh_004",
      location: "Dhaka Medical College Hospital",
      type: "Plasma",
      date: "2023-10-18T11:00:00.000Z",
      status: "COMPLETED",
    },
    {
      id: "dh_005",
      location: "Square Hospital",
      type: "Double Red Cells",
      date: "2023-07-04T08:30:00.000Z",
      status: "COMPLETED",
    },
  ],

  // ── Requests made
  requestsMade: [
    {
      id: "req_001",
      requestNo: "4920",
      bloodGroup: "B+",
      reason: "Type B+ required for surgery",
      hospital: "St. Jude Medical Center, Chicago",
      urgency: "URGENT",
      respondedDonors: 4,
      createdAt: "2024-09-01T08:00:00.000Z",
      status: "ACTIVE",
    },
    {
      id: "req_002",
      requestNo: "4761",
      bloodGroup: "O-",
      reason: "Post-accident emergency transfusion",
      hospital: "Dhaka Medical College Hospital",
      urgency: "EMERGENCY",
      respondedDonors: 7,
      createdAt: "2024-06-15T14:30:00.000Z",
      status: "FULFILLED",
    },
  ],

  // ── Meta
  memberSince: "2021-03-10T00:00:00.000Z",
  bio: "Passionate about saving lives through regular blood donation. O− universal donor — always ready when it matters most.",
  age: 28,
  weight: 72,
  gender: "Male",

  // ── Settings
  settings: {
    notifications: {
      emergencyAlerts: false,
      urgentRequests: true,
      nearbyRequests: true,
      donationReminders: true,
      requestUpdates: true,
      newMessages: true,
      emailDigest: false,
      smsAlerts: true,
    },
    privacy: {
      showInSearch: true,
      showPhone: true,
      showEmail: true,
      showDonationHistory: false,
      allowDirectContact: true,
    },
  },
};
