"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircleMore, PencilLine, Star } from "lucide-react";
import toast from "react-hot-toast";
import ReviewStars from "./ReviewStars";

type Review = {
  id: number;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: {
    fullName: string;
  };
};

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadReviews = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać opinii");
        return;
      }

      setReviews(data);
    } catch {
      toast.error("Wystąpił błąd połączenia");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const ratingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((value) => {
      const count = reviews.filter((review) => review.rating === value).length;
      const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

      return {
        value,
        count,
        percentage,
      };
    });
  }, [reviews]);

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

      setReviews((prev) => [data, ...prev]);
      setRating(5);
      setTitle("");
      setComment("");

      toast.success("Opinia została dodana", { id: toastId });
    } catch {
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-8">
          <div className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Opinie klientów
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
              Ocena produktu
            </h2>

            <div className="mt-8 rounded-[28px] border border-black/5 bg-[#fafafa] p-6">
              <div className="flex items-end gap-4">
                <span className="text-5xl font-bold tracking-tight text-gray-950">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </span>
                <div className="pb-1">
                  <ReviewStars rating={Math.round(averageRating)} />
                  <p className="mt-2 text-sm text-gray-500">
                    Na podstawie {reviews.length} opinii
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {ratingBreakdown.map((item) => (
                  <div
                    key={item.value}
                    className="grid grid-cols-[42px_1fr_36px] items-center gap-3"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.value}.0
                    </span>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <span className="text-right text-sm text-gray-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
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
        </div>

        <div className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-black p-3 text-white">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Recenzje klientów
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-950">
                Co mówią kupujący
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-8 rounded-[28px] bg-[#fafafa] p-6 text-gray-600">
              Ładowanie opinii...
            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-8 rounded-[28px] bg-[#fafafa] p-6 text-gray-600">
              Ten produkt nie ma jeszcze opinii.
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[28px] border border-black/5 bg-[#fafafa] p-6 transition hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-950">
                        {review.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {review.user.fullName}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex justify-end">
                        <ReviewStars rating={review.rating} size="sm" />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-8 text-gray-600">
                    {review.comment}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                    <Star className="h-3.5 w-3.5" />
                    Zweryfikowana opinia użytkownika sklepu
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}