"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  ShieldCheck,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Globe,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { dummyDonor } from "@/data/dummyDonor";

type Tab = "profile" | "notifications" | "privacy" | "account";

// ── Shared primitives ─────────────────────────────────────────────────────────

const labelClass =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

const inputClass =
  "w-full min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 focus:bg-white transition-all";

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
        <p className="text-sm sm:text-base font-bold text-gray-900">{title}</p>

        {description && (
          <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-10 h-[22px] cursor-pointer rounded-full shrink-0 transition-colors ${on ? "bg-rose-500" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? "right-[3px]" : "left-[3px]"}`}
      />
    </button>
  );
}

function ToggleRow({
  label,
  desc,
  on,
  onChange,
}: {
  label: string;
  desc?: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          {label}
        </p>
        {desc && (
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
        )}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ donor }: { donor: typeof dummyDonor }) {
  return (
    <div className="space-y-4">
      {/* Photo */}
      <Card title="Profile Photo">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={donor.avatar}
              alt={donor.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <span className="absolute -top-1.5 -left-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow leading-tight">
              {donor.bloodGroup}
            </span>
          </div>
          <div className="min-w-0">
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors">
              <Camera className="w-3.5 h-3.5" />
              Change Photo
            </button>
            <p className="text-[11px] text-gray-400 mt-1.5">
              JPG, PNG or WebP · Max 2MB
            </p>
          </div>
        </div>
      </Card>

      {/* Personal */}
      <Card
        title="Personal Information"
        description="Update your basic profile details"
      >
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} defaultValue={donor.name} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Age</label>
              <input
                className={inputClass}
                type="number"
                defaultValue={donor.age}
              />
            </div>
            <div>
              <label className={labelClass}>Weight (kg)</label>
              <input
                className={inputClass}
                type="number"
                defaultValue={donor.weight}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select className={inputClass} defaultValue={donor.gender}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              defaultValue={donor.bio}
            />
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card
        title="Contact Information"
        description="Used to connect you with those in need"
      >
        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </span>
            </label>
            <input
              className={inputClass}
              defaultValue={donor.phone}
              type="tel"
            />
          </div>
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </span>
            </label>
            <input
              className={inputClass}
              defaultValue={donor.email}
              type="email"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> City
                </span>
              </label>
              <input className={inputClass} defaultValue={donor.city} />
            </div>
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Country
                </span>
              </label>
              <input className={inputClass} defaultValue={donor.country} />
            </div>
          </div>
        </div>
      </Card>

      {/* Blood */}
      <Card
        title="Blood Information"
        description="Critical for matching you with the right requests"
      >
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1">
              <Droplet className="w-3 h-3" /> Blood Group
            </span>
          </label>
          <select className={inputClass} defaultValue={donor.bloodGroup}>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="flex justify-end">
        <button className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────

function NotificationsTab({ donor }: { donor: typeof dummyDonor }) {
  const [s, setS] = useState(donor.settings.notifications);
  const set = (k: keyof typeof s) => (v: boolean) =>
    setS((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <Card
        title="Emergency & Requests"
        description="Alerts for blood requests in your area"
      >
        <ToggleRow
          label="Emergency Alerts"
          desc="Immediate alerts for emergency blood needs"
          on={s.emergencyAlerts}
          onChange={set("emergencyAlerts")}
        />
        <ToggleRow
          label="Urgent Requests"
          desc="Notify me about urgent requests matching my blood group"
          on={s.urgentRequests}
          onChange={set("urgentRequests")}
        />
        <ToggleRow
          label="Nearby Requests"
          desc="Requests within your city or district"
          on={s.nearbyRequests}
          onChange={set("nearbyRequests")}
        />
      </Card>
      <Card
        title="Activity"
        description="Stay updated on your donations and responses"
      >
        <ToggleRow
          label="Donation Reminders"
          desc="Remind me when I'm eligible to donate again"
          on={s.donationReminders}
          onChange={set("donationReminders")}
        />
        <ToggleRow
          label="Request Updates"
          desc="Updates on requests you've responded to"
          on={s.requestUpdates}
          onChange={set("requestUpdates")}
        />
        <ToggleRow
          label="New Messages"
          desc="When someone contacts you about a request"
          on={s.newMessages}
          onChange={set("newMessages")}
        />
      </Card>
      <Card
        title="Delivery Channels"
        description="How you'd like to receive notifications"
      >
        <ToggleRow
          label="SMS Alerts"
          desc="Critical alerts via text message"
          on={s.smsAlerts}
          onChange={set("smsAlerts")}
        />
        <ToggleRow
          label="Weekly Email Digest"
          desc="Summary of activity and nearby requests"
          on={s.emailDigest}
          onChange={set("emailDigest")}
        />
      </Card>
    </div>
  );
}

// ── Privacy Tab ───────────────────────────────────────────────────────────────

function PrivacyTab({ donor }: { donor: typeof dummyDonor }) {
  const [p, setP] = useState(donor.settings.privacy);
  const set = (k: keyof typeof p) => (v: boolean) =>
    setP((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-4">
      {/* Verification banner */}
      <div
        className={`rounded-2xl border p-4 ${donor.verified ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-200"}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${donor.verified ? "bg-emerald-100" : "bg-amber-100"}`}
          >
            {donor.verified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-bold ${donor.verified ? "text-emerald-800" : "text-amber-800"}`}
            >
              {donor.verified ? "Identity Verified" : "Identity Not Verified"}
            </p>
            <p
              className={`text-xs mt-0.5 leading-relaxed ${donor.verified ? "text-emerald-600" : "text-amber-600"}`}
            >
              {donor.verified
                ? "Your identity has been confirmed. You have full platform access."
                : "Verify your identity to appear in emergency searches and gain full access."}
            </p>
            {!donor.verified && (
              <button className="mt-3 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                <ShieldCheck className="w-3.5 h-3.5" /> Verify Now
              </button>
            )}
          </div>
        </div>
      </div>

      <Card
        title="Profile Visibility"
        description="Control what others can see on your public profile"
      >
        <ToggleRow
          label="Show in Donor Search"
          desc="Allow patients to find you in search results"
          on={p.showInSearch}
          onChange={set("showInSearch")}
        />
        <ToggleRow
          label="Show Phone Number"
          desc="Visible to verified users contacting you"
          on={p.showPhone}
          onChange={set("showPhone")}
        />
        <ToggleRow
          label="Show Email Address"
          desc="Visible on your public profile"
          on={p.showEmail}
          onChange={set("showEmail")}
        />
        <ToggleRow
          label="Show Donation History"
          desc="Others can see your donation count and timeline"
          on={p.showDonationHistory}
          onChange={set("showDonationHistory")}
        />
        <ToggleRow
          label="Allow Direct Contact"
          desc="Let patients message you via WhatsApp"
          on={p.allowDirectContact}
          onChange={set("allowDirectContact")}
        />
      </Card>
    </div>
  );
}

// ── Account Tab ───────────────────────────────────────────────────────────────

function AccountTab() {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-4">
      <Card title="Change Password" description="Use a strong, unique password">
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Update Password
            </button>
          </div>
        </div>
      </Card>

      <Card title="Danger Zone">
        <div className="space-y-3">
          {/* Sign out */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <div className="flex items-start gap-2.5 min-w-0">
              <LogOut className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800">Sign Out</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <button className="shrink-0 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
              Sign Out
            </button>
          </div>
          {/* Delete */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-rose-100 bg-rose-50">
            <div className="flex items-start gap-2.5 min-w-0">
              <Trash2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-rose-700">
                  Delete Account
                </p>
                <p className="text-xs text-rose-400 mt-0.5">
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
              </div>
            </div>
            <button className="shrink-0 text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
              Delete
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "account", label: "Account", icon: Lock },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const donor = dummyDonor;

  return (
    <main className="pt-24 pb-20 container mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your profile, notifications, and account preferences.
        </p>
      </div>

      {/* ── TAB NAV — single layout, works at all widths ─────────── */}
      <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center cursor-pointer justify-center gap-1 py-2.5 px-1 rounded-xl text-center transition-colors ${
              activeTab === id
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-bold leading-none truncate w-full text-center">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <div className="w-full min-w-0">
        {activeTab === "profile" && <ProfileTab donor={donor} />}
        {activeTab === "notifications" && <NotificationsTab donor={donor} />}
        {activeTab === "privacy" && <PrivacyTab donor={donor} />}
        {activeTab === "account" && <AccountTab />}
      </div>
    </main>
  );
}
