interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <div className={`text-center mb-20 ${className}`}>
      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-2xl text-gris-doux max-w-4xl mx-auto leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
