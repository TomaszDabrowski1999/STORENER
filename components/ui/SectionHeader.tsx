type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-4xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}