'use client';

import type { ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react';
import Link from 'next/link';
import { Icon, type IconName } from './Icon';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'tertiary' | 'destructive';
type ButtonSize = 'lg' | 'md';

const BUTTON_ICON_PX = 20;

const BASE =
  'inline-flex select-none items-center justify-center gap-2 text-center transition-colors duration-150 motion-reduce:transition-none';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'rounded-md bg-primary text-on-primary active:bg-primary-active disabled:bg-primary-disabled disabled:text-muted',
  accent: 'rounded-md bg-accent text-on-accent active:bg-accent-active disabled:opacity-50',
  secondary: 'rounded-md border border-hairline bg-canvas text-ink active:bg-surface-soft disabled:text-muted-soft',
  destructive: 'rounded-md border border-error bg-canvas text-error active:bg-error-tint',
  tertiary: 'min-h-12 px-2 text-link text-primary-text underline disabled:text-muted-soft',
};

const SIZE: Record<ButtonSize, string> = {
  lg: 'h-14 px-6 text-button-lg',
  md: 'h-12 px-6 text-button-md',
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: IconName;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'lg',
  href,
  icon,
  fullWidth = true,
  children,
  disabled,
  type = 'button',
  onPointerDown,
  ...rest
}: ButtonProps) => {
  const isText = variant === 'tertiary';
  // A focused input must not blur before the click fires, or the soft keyboard closes,
  // the layout shifts, and the tap lands on nothing (real-device sticky-footer bug).
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    onPointerDown?.(event);
  };
  const className = [BASE, VARIANT[variant], isText ? '' : SIZE[size], fullWidth && !isText ? 'w-full' : '']
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {icon ? <Icon name={icon} size={BUTTON_ICON_PX} /> : null}
      <span>{children}</span>
    </>
  );

  return href && !disabled ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button type={type} disabled={disabled} className={className} onPointerDown={handlePointerDown} {...rest}>
      {content}
    </button>
  );
};
