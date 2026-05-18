"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({ images, name }: ProductGalleryProps) {
const validImages = images.filter(
  (image) =>
    typeof image === "string" &&
    image.trim() !== "" &&
    image !== "null" &&
    image !== "undefined" &&
    !image.startsWith("/uploads")
);

  const [activeImage, setActiveImage] = useState(validImages[0] || "");

  if (!activeImage) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-[30px] bg-white text-gray-400">
        Brak zdjęcia produktu
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-[30px] border border-black/5 bg-white">
        <Image
          src={activeImage}
          alt={name}
          width={900}
          height={900}
          className="h-[520px] w-full object-contain"
          priority
        />
      </div>

      {validImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-2xl border bg-white transition ${
                activeImage === image
                  ? "border-black"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                width={180}
                height={180}
                className="h-24 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}