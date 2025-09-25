interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <div className={`text-center mb-20 ${className}`}>
      {title && (
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-6">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="font-sans text-base text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
