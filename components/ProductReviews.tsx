"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PencilLine } from "lucide-react";

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !comment) {
      toast.error("Uzupełnij tytuł i treść opinii");
      return;
    }

    const toastId = toast.loading("Dodawanie opinii...");

    try {
      setIsSaving(true);

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          title,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Nie udało się dodać opinii", {
          id: toastId,
        });
        return;
      }

      setRating(5);
      setTitle("");
      setComment("");

      toast.success("Dziękujemy. Twoja opinia została zapisana.", { id: toastId });
    } catch {
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-black p-3 text-white">
            <PencilLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Dodaj opinię
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">
              Podziel się swoją oceną
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-gray-600">
          Opinie pomagają nam ulepszać ofertę. Oceny i recenzje nie są publicznie
          wyświetlane klientom.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ocena
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
            >
              <option value={5}>5 / 5</option>
              <option value={4}>4 / 5</option>
              <option value={3}>3 / 5</option>
              <option value={2}>2 / 5</option>
              <option value={1}>1 / 5</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tytuł opinii
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              placeholder="Np. Bardzo dobry produkt"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Treść opinii
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              placeholder="Opisz swoje wrażenia z produktu"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSaving ? "Dodawanie opinii..." : "Dodaj opinię"}
          </button>
        </form>
      </div>
    </section>
  );
}
