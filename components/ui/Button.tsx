import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-black text-white hover:opacity-90",
        variant === "secondary" &&
          "border border-black bg-white text-black hover:bg-black hover:text-white",
        variant === "ghost" &&
          "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-black",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}