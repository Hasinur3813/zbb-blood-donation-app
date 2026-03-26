import Link from 'next/link';
import { Droplet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Droplet className="h-6 w-6 text-primary fill-primary" />
              <span className="text-xl font-bold">VitalFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting blood donors with patients in need. A platform dedicated to saving lives through community effort.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/donors" className="hover:text-primary">Find Donors</Link></li>
              <li><Link href="/request-blood" className="hover:text-primary">Request Blood</Link></li>
              <li><Link href="/register-donor" className="hover:text-primary">Become a Donor</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/guidelines" className="hover:text-primary">Donation Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VitalFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
