"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import type { LucideIcon } from "lucide-react";
import type { BloodGroup } from "@/types/donor";
import {
  Droplet,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Heart,
  Bell,
  Settings,
  Activity,
} from "lucide-react";

type NavLink = {
  name: string;
  href: string;
  icon?: LucideIcon;
};

type SessionUser = {
  name: string;
  email: string;
  bloodGroup: BloodGroup;
  avatar: string;
  notifications: number;
};

const publicNavLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Find Donors", href: "/donors" },
  { name: "Request Blood", href: "/request-blood" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const authNavLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Find Donors", href: "/donors" },
  { name: "Request Blood", href: "/request-blood" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((state) => state.auth.user);

  const currentUser: SessionUser | null = sessionUser
    ? {
        name: sessionUser.name,
        email: sessionUser.email,
        avatar: sessionUser.avatar,
        bloodGroup: sessionUser.bloodGroup,
        notifications: 0,
      }
    : null;

  const navLinks = currentUser ? authNavLinks : publicNavLinks;

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setProfileOpen(false);
  }

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "";

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Backdrop blur bar */}
        <div className="absolute inset-0 bg-white/97 border-b border-rose-100 backdrop-blur-md shadow-sm shadow-rose-50" />

        <div className="relative container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <Droplet className="h-7 w-7 text-rose-600 fill-rose-600 transition-transform group-hover:scale-110 duration-200" />
              {/* Pulse dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Vital<span className="text-rose-600">Flow</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const NavIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    isActive(link.href)
                      ? "text-rose-600 bg-rose-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {NavIcon ? <NavIcon className="w-3.5 h-3.5" /> : null}
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-rose-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Donate — always visible */}
            <Link
              href="/donate"
              className="ml-2 relative inline-flex items-center gap-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 px-4 py-1.5 rounded-full transition-colors shadow-md shadow-rose-200"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Donate
            </Link>
          </nav>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <>
                {/* Notification Bell */}
                <button className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  {currentUser && currentUser.notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {currentUser.notifications}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center cursor-pointer gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-rose-50 transition-colors group"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-rose-100 group-hover:ring-rose-200 transition-all overflow-hidden">
                      {currentUser.avatar ? (
                        <Image
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-gray-800 leading-none">
                        {currentUser.name.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-rose-500 font-bold leading-none mt-0.5">
                        {currentUser.bloodGroup}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-100 overflow-hidden z-50 animate-in">
                      {/* User Info */}
                      <div className="px-4 py-3 bg-linear-to-br from-rose-50 to-white border-b border-rose-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white text-sm font-bold">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {currentUser.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <Droplet className="w-2.5 h-2.5 fill-white" />
                            {currentUser.bloodGroup}
                          </span>
                          <span className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                            ● Active Donor
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {[
                          {
                            icon: LayoutDashboard,
                            label: "Dashboard",
                            href: "/dashboard",
                          },
                          {
                            icon: Heart,
                            label: "My Donations",
                            href: "/dashboard/my-donations",
                          },
                          {
                            icon: Activity,
                            label: "Manage Requests",
                            href: "/dashboard/manage-requests",
                          },
                          {
                            icon: Settings,
                            label: "Settings",
                            href: "/dashboard/settings",
                          },
                        ].map(({ icon: Icon, label, href }) => (
                          <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => {
                            dispatch(logout());
                            window.location.href = "/";
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest Buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-md hover:bg-rose-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register-donor"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-rose-100"
                >
                  Become a Donor
                </Link>
              </div>
            )}

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-rose-100 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Logged-in user banner */}
            {currentUser && (
              <div className="px-4 py-4 bg-linear-to-r from-rose-50 to-white border-b border-rose-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <Droplet className="w-2.5 h-2.5 fill-white" />
                    {currentUser.bloodGroup}
                  </span>
                  {currentUser && currentUser.notifications > 0 && (
                    <span className="text-[11px] text-rose-600 font-semibold">
                      {currentUser.notifications} new notifications
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="px-3 py-3 space-y-0.5">
              {navLinks.map((link) => {
                const NavIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-rose-600 bg-rose-50 font-semibold"
                        : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                  >
                    {NavIcon ? <NavIcon className="w-4 h-4" /> : null}
                    {link.name}
                    {isActive(link.href) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                  </Link>
                );
              })}

              {/* Donate */}
              <Link
                href="/donate"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Heart className="w-4 h-4 fill-rose-600" />
                Donate Blood
              </Link>
            </nav>

            {/* Logged-in: profile links */}
            {currentUser ? (
              <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
                {[
                  { icon: User, label: "My Profile", href: "/profile" },
                  { icon: Heart, label: "My Donations", href: "/my-donations" },
                  {
                    icon: Bell,
                    label: "Notifications",
                    href: "/notifications",
                    badge: currentUser.notifications,
                  },
                  { icon: Settings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {badge && badge > 0 ? (
                      <span className="ml-auto w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    dispatch(logout());
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              /* Guest CTA */
              <div className="border-t border-gray-100 px-4 py-4 space-y-2">
                <Link
                  href="/register-donor"
                  className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-md shadow-rose-100"
                >
                  Become a Donor
                </Link>
                <Link
                  href="/login"
                  className="block w-full text-center border border-gray-200 hover:border-rose-200 text-gray-600 hover:text-rose-600 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
