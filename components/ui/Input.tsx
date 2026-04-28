import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function Input({ error, className, ...props }: InputProps) {
  return (
    <div>
      <input
        className={clsx(
          "w-full rounded-xl border px-4 py-3 outline-none transition",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-black",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}