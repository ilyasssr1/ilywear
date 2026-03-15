"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-black text-gray-900 mb-6">404</div>

        <h1 className="text-3xl font-black text-gray-900 mb-3 uppercase">
          Page Not Found
        </h1>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="w-full bg-accent text-black px-6 py-4 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
