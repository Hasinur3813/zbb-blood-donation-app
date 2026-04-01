import Link from "next/link";
import { Search, Home, ArrowRight, Droplet } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back to finding blood donors or making life-saving requests.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>

          <Link
            href="/donate"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Droplet className="w-5 h-5" />
            Find Blood Requests
          </Link>

          <Link
            href="/request-blood"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            Request Blood
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> If you believe this is an error, please
            <Link
              href="/contact"
              className="underline hover:text-blue-900 ml-1"
            >
              contact our support team
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Common pages you might be looking for:</p>
          <div className="mt-2 space-y-1">
            <Link
              href="/donors"
              className="text-blue-600 hover:underline block"
            >
              • Find Donors
            </Link>
            <Link href="/about" className="text-blue-600 hover:underline block">
              • About VitalFlow
            </Link>
            <Link href="/login" className="text-blue-600 hover:underline block">
              • Login / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
