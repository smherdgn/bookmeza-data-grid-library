
import React from 'react';
import { BookmezaInputProps } from '../types';

const BookmezaInput: React.FC<BookmezaInputProps> = ({ 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  className = "",
  type = "text",
  ...props
}) => (
  <div className={`relative ${className}`}>
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 
        bg-white/80 backdrop-blur-sm border border-slate-300 
        rounded-lg text-sm placeholder-slate-400 text-slate-900
        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
        hover:bg-white/90 hover:border-slate-400
        transition-all duration-200
      `}
      {...props}
    />
  </div>
);

export default BookmezaInput;
