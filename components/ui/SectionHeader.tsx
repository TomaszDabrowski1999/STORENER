type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--green-dark)" }}
        >
          {eyebrow}
        </p>
      )}

      <h1
        className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`mt-3 text-base leading-relaxed text-gray-600 ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
