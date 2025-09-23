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
  const baseClasses = "inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const buttonClasses = `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${className}`;

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
