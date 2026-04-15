import React, { ReactNode } from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  isLoading?: boolean;
  textClass?: string
}

const CustomButton = ({
  title,
  variant = 'primary',
  size = 'md',
  leftSection,
  rightSection,
  isLoading,
  className = '',
  textClass = '',
  disabled,
  ...props
}: CustomButtonProps) => {

  const variants = {
    primary: 'bg-[#257448] text-white hover:bg-white hover:text-[#257448] shadow-md text-white',
    secondary: 'bg-[#DBFCE7] text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-destructive text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-sm',
    md: 'px-3 lg:px-5 py-2 lg:py-2.5 text-sm rounded-md',
    lg: 'px-8 py-3 text-base rounded-lg',
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 font-poppins cursor-pointer truncate';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} group`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {/* Left Section */}
      {!isLoading && leftSection && (
        <span 
          className={`mr-2 flex items-center text-xl ${textClass}`}
        >
          {leftSection}
        </span>
      )}

      {/* Button Text */}
      <span className={`${textClass}`}>
        {title}
      </span>

      {/* Right Section */}
      {!isLoading && rightSection && (
        <p 
          className={`ml-2 flex items-center text-xl ${textClass}`}
        >
          {rightSection}
        </p>
      )}
    </button>
  );
};

export default CustomButton;