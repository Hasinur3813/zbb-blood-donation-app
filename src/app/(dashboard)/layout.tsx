"use client";

import { ReactNode, useState } from "react";
import {
  Home,
  Heart,
  Droplet,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", icon: Home, href: "/dashboard" },
    {
      name: "Lives Impacted",
      icon: Heart,
      href: "/dashboard/lives-impacted",
    },
    { name: "Donations", icon: Droplet, href: "/dashboard/donations" },
    {
      name: "Eligibility",
      icon: CalendarCheck,
      href: "/dashboard/eligibility",
    },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Logout", icon: LogOut, href: "/dashboard/logout" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white w-64 p-6 flex flex-col justify-between border-r border-gray-200 transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold text-primary">BloodApp</div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const pathname = usePathname(); // current route
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors font-medium
          ${isActive ? "bg-primary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Version */}
        <div className="text-xs text-gray-400">© 2026 BloodApp</div>
      </aside>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-5 left-5 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ">
        <div className="p-6 overflow-auto h-screen">{children}</div>
      </div>
    </div>
  );
}
