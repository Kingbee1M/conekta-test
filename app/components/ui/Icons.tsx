'use client'

import React, { useEffect, useState } from 'react';

const SIZES = {
  xxs: 10,
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

type IconSize = keyof typeof SIZES | number;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  size?: IconSize;
}

export const Icons = ({ 
  name,
  size = "md",
  className = "", 
  ...props 
}: IconProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const finalSize = typeof size === 'number' ? size : SIZES[size as keyof typeof SIZES] || SIZES.md;
  const src = `/svg/${name}.svg`;

  useEffect(() => {
    if (!name) return;

    // Fetch the raw file and "inject" it as an icon
    fetch(src)
      .then((res) => res.text())
      .then((data) => {
        const cleaned = data
          .replace(/<svg/, `<svg width="${finalSize}" height="${finalSize}" class="${className}"`)
          .replace(/width=".*?"/, '') // Remove hardcoded widths
          .replace(/height=".*?"/, '');
        
        setSvgContent(cleaned);
      })
      .catch(() => console.error(`Icon "${name}" not found at ${src}`));
  }, [name, finalSize, className, src]);

  if (!svgContent) return <i style={{ width: finalSize, height: finalSize }} className="inline-block" />;

  return (
    <i
      role="img"
      aria-label={`${name} icon`}
      className={`ui-icon-wrapper inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
};