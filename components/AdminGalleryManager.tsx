"use client";

import { useMemo, useRef, useState } from "react";

type AdminGalleryManagerProps = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  title?: string;
};

export default function AdminGalleryManager({
  images,
  onChange,
  maxImages = 12,
  title = "Galeria produktu",
}: AdminGalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filledImages = useMemo(
    () => images.filter((img) => img.trim() !== ""),
    [images]
  );

  const uploadFiles = async (files: FileList | File[]) => {
    setError("");

    const fileArray = Array.from(files);
    const currentCount = filledImages.length;

    if (currentCount + fileArray.length > maxImages) {
      setError(`Możesz mieć maksymalnie ${maxImages} zdjęć w galerii`);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload-multiple", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się przesłać zdjęć");
        return;
      }

      const nextImages = [...filledImages, ...(data.urls || [])].slice(0, maxImages);
      onChange(nextImages);
    } catch {
      setError("Wystąpił błąd połączenia przy uploadzie zdjęć");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDropZoneDrop = async (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const nextImages = [...filledImages];
    nextImages.splice(index, 1);
    onChange(nextImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const nextImages = [...filledImages];
    const [moved] = nextImages.splice(fromIndex, 1);
    nextImages.splice(toIndex, 0, moved);

    onChange(nextImages);
  };

  const handleThumbDrop = (targetIndex: number) => {
    if (draggedIndex === null) return;
    moveImage(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {title}
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Maksymalnie {maxImages} zdjęć. Możesz przeciągać, zmieniać kolejność i usuwać.
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {filledImages.length}/{maxImages}
        </span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropZoneDrop}
        className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center"
      >
        <p className="text-sm text-gray-600">
          Przeciągnij zdjęcia tutaj albo wybierz z dysku
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {isUploading ? "Przesyłanie..." : "Dodaj zdjęcia"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {filledImages.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filledImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleThumbDrop(index)}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <img
                src={image}
                alt={`Galeria ${index + 1}`}
                className="h-32 w-full object-cover"
              />

              <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                #{index + 1}
              </div>

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white opacity-100 transition hover:bg-red-700"
              >
                Usuń
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center text-xs font-medium text-white">
                Przeciągnij, aby zmienić kolejność
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}