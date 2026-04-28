import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("rounded-3xl bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}