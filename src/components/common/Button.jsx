import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';
  
  const variants = {
    primary: 'bg-gradient-to-r from-farm-600 to-emerald-500 hover:from-farm-500 hover:to-emerald-400 text-white shadow-lg shadow-farm-900/20 hover:shadow-glow-green hover:-translate-y-0.5 focus:ring-farm-500',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 hover:border-white/20 focus:ring-slate-500',
    glass: 'bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10 backdrop-blur-md focus:ring-white/20',
    danger: 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-500/20 focus:ring-rose-500',
    accent: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-semibold hover:brightness-110 shadow-lg shadow-yellow-500/10 focus:ring-yellow-500 hover:-translate-y-0.5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed transform-none hover:transform-none hover:shadow-none hover:brightness-100';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {Icon && <Icon className={`mr-2 ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
      {children}
    </button>
  );
};

export default Button;
