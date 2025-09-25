import Link from 'next/link';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({ href, onClick, children, className = "", type = "button", disabled = false }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg px-8 py-4 font-medium font-sans transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Determine button style based on className
  const isSecondary = className.includes('btn-secondary');
  const isPrimary = !isSecondary;
  
  const buttonClasses = isPrimary 
    ? `${baseClasses} btn-primary ${className}`
    : `${baseClasses} btn-secondary ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={buttonClasses}>
      {children}
    </button>
  );
}
