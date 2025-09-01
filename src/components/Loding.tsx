"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-sparkle"></div>

        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
