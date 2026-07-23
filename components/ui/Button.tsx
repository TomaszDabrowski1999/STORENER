import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "green" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        // Wspólna baza: zaokrąglenia i typografia zgodne z resztą sklepu,
        // widoczny focus ring (dostępność / obsługa klawiaturą).
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight",
        "transition-all duration-200 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        size === "sm" && "px-4 py-2 text-xs",
        size === "md" && "px-5 py-3 text-sm",
        size === "lg" && "px-7 py-3.5 text-base",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-[#0a0a0a] text-white shadow-sm hover:bg-[#1a1a1a] hover:shadow-lg focus-visible:ring-gray-950",
        variant === "green" &&
          "bg-[#4caf3d] text-white shadow-sm hover:bg-[#3a9a2c] hover:shadow-lg focus-visible:ring-[#4caf3d]",
        variant === "secondary" &&
          "border border-[#e8e8e6] bg-white text-gray-950 hover:border-gray-950 hover:bg-gray-950 hover:text-white focus-visible:ring-gray-950",
        variant === "ghost" &&
          "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950 focus-visible:ring-gray-300",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {children}
    </button>
  );
}
