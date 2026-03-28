"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Donors", href: "/donors" },
    { name: "Request Blood", href: "/request-blood" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Donate", href: "/donate" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Droplet className="h-6 w-6 text-primary fill-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            VitalFlow
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}

                {/* Underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-primary transition-all ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  } origin-left`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Log in
          </Link>
          <Link
            href="/register-donor"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Become a Donor
          </Link>
        </div>
      </div>
    </header>
  );
}
