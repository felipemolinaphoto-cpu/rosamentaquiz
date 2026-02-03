
import React from 'react';
import { COLORS } from '../constants';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', color }) => {
  const scale = size === 'sm' ? '0.4' : size === 'lg' ? '1.2' : '0.8';
  const iconColor = color || COLORS.black;
  
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`} style={{ transform: `scale(${scale})`, height: '200px', width: '200px' }}>
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full items-center justify-items-center">
        {/* Top Left: R */}
        <span className="serif text-9xl font-light leading-none select-none -translate-x-2" style={{ color: iconColor }}>R</span>
        
        {/* Top Right: 8-pointed Star */}
        <svg viewBox="0 0 100 100" className="w-20 h-20" style={{ fill: iconColor }}>
          <path d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
        </svg>

        {/* Bottom Left: 8-pointed Star */}
        <svg viewBox="0 0 100 100" className="w-20 h-20" style={{ fill: iconColor }}>
          <path d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
        </svg>

        {/* Bottom Right: M */}
        <span className="serif text-9xl font-light leading-none select-none translate-x-2" style={{ color: iconColor }}>M</span>
      </div>
    </div>
  );
};

export default Logo;
