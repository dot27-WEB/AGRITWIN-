import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  className = '',
  hoverGlow = true,
  variant = 'green', // 'green' or 'gold' or 'standard'
  headerActions
}) => {
  const baseCard = 'glass-card p-6 rounded-2xl overflow-hidden relative';
  
  const hoverStyles = hoverGlow 
    ? (variant === 'gold' ? 'glass-card-gold hover:border-amber-500/30' : 'hover:border-farm-500/30') 
    : 'hover:transform-none hover:shadow-none';

  return (
    <div className={`${baseCard} ${hoverStyles} ${className}`}>
      {/* Dynamic ambient card glow backgrounds */}
      {hoverGlow && (
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none filter blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20
          ${variant === 'gold' ? 'bg-amber-400' : 'bg-farm-400'}`} 
        />
      )}

      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between mb-4 border-b border-white/5 pb-3 relative z-10">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white tracking-wide flex items-center">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
