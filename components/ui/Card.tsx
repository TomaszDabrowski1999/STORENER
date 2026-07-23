import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
};

export default function Card({
  children,
  className,
  padding = "md",
  hover,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-[28px] bg-white",
        padding === "sm" && "p-4",
        padding === "md" && "p-6 sm:p-8",
        padding === "lg" && "p-8 sm:p-10",
        hover && "transition-all duration-300 hover:-translate-y-0.5",
        className
      )}
      style={{
        border: "1px solid var(--border)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      {children}
    </div>
  );
}
