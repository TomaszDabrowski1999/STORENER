"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);
  const [activeImage, setActiveImage] = useState(safeImages[0] || "");

  if (safeImages.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm">
        <div className="flex h-[500px] items-center justify-center text-gray-400">
          Brak zdjęć produktu
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm">
        <img
          src={activeImage}
          alt={name}
          className="h-[500px] w-full object-cover"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {safeImages.slice(0, 12).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-2xl border transition ${
              activeImage === image
                ? "border-black ring-2 ring-black/10"
                : "border-gray-200 hover:border-black"
            }`}
          >
            <img
              src={image}
              alt={`${name} ${index + 1}`}
              className="h-24 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}