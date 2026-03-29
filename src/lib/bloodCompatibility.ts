import type { BloodGroup } from "@/types/donor";

/** Red blood cell donation: which recipient types a donor can supply. */
const DONOR_TO_RECIPIENTS: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export function canDonorDonateToRecipient(
  donorBlood: BloodGroup,
  recipientNeeds: BloodGroup,
): boolean {
  return DONOR_TO_RECIPIENTS[donorBlood]?.includes(recipientNeeds) ?? false;
}
