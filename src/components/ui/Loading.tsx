"use client";

import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "circle" | "rectangle";
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "rectangle",
  width = "w-full",
  height = "h-4",
  count = 1,
  className,
}) => {
  const skeletons = Array.from({ length: count });

  const skeletonClass = clsx(
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse",
    {
      "rounded-lg": variant !== "circle",
      "rounded-full": variant === "circle",
    },
    width,
    height,
    className,
  );

  if (variant === "card") {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skeletons.map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  fullScreen,
  text,
}) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={clsx(sizeMap[size], "animate-spin text-black")} />
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  text = "Loading...",
}) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <LoadingSpinner fullScreen text={text} />
  </div>
);
