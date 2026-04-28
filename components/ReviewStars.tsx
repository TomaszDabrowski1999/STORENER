type ReviewStarsProps = {
  rating: number;
  size?: "sm" | "md";
};

export default function ReviewStars({
  rating,
  size = "md",
}: ReviewStarsProps) {
  const starClass = size === "sm" ? "text-sm" : "text-xl";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${starClass} ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}