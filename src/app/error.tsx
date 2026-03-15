"use client";

import Link from "next/link";
import { AlertCircle, Home, ShoppingBag, Phone } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          We encountered an unexpected error. Our team has been notified.
        </p>

        {error?.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
            <p className="text-[11px] font-mono text-red-700 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-black text-white px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="w-full bg-accent text-black px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/contact"
            className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
