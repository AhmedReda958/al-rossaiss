"use client";

import LandmarksHeader from "./header";

export default function LandmarksPage() {
  return (
    <>
      <LandmarksHeader />
      <div className="py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">
            Discover and manage landmarks across different regions. Add new
            landmarks, edit existing ones, and explore their details.
          </p>
        </div>
      </div>
    </>
  );
}
