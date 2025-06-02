
import React from 'react';
import { BookmezaButtonProps } from '../types';

const BookmezaButton: React.FC<BookmezaButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs", // smaller text for sm
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]} 
        ${sizes[size]}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`h-4 w-4 ${children ? 'mr-1' : ''}`} />}
      {children}
    </button>
  );
};

export default BookmezaButton;
