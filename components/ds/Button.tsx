'use client';

import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { useRipple } from '@/lib/hooks/useRipple';
import s from './Button.module.css';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', fullWidth, className, onClick, children, ...rest }, ref) => {
    const ripple = useRipple();
    const cls = [
      s.btn,
      s[variant],
      size !== 'md' && s[size],
      fullWidth && s.fullWidth,
      className,
    ].filter(Boolean).join(' ');

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      ripple(e);
      onClick?.(e);
    };

    return (
      <button ref={ref} className={cls} onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
export default Button;
