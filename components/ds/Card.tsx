'use client';

import { forwardRef, type HTMLAttributes, type MouseEvent, useCallback } from 'react';
import s from './Card.module.css';

type Variant = 'default' | 'active' | 'locked';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, Props>(
  ({ variant = 'default', interactive, glow, className, onMouseMove, children, ...rest }, ref) => {
    const cls = [
      s.card,
      variant !== 'default' && s[variant],
      interactive && s.interactive,
      glow && s.glow,
      className,
    ].filter(Boolean).join(' ');

    const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
      if (glow) {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
      }
      onMouseMove?.(e);
    }, [glow, onMouseMove]);

    return (
      <div ref={ref} className={cls} onMouseMove={handleMove} {...rest}>
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';
export default Card;
