import React from 'react';
import { Link } from 'react-router-dom';

const baseClasses =
  'inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:
    'bg-primary text-background shadow-lift hover:bg-primary-strong hover:text-ink active:scale-[0.98]',
  secondary:
    'border border-outline bg-surface-soft text-ink hover:border-primary/60 hover:bg-surface-strong active:scale-[0.98]',
  ghost:
    'text-muted hover:bg-surface-soft hover:text-ink active:scale-[0.98]',
};

const sizes = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-3 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
};

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  to,
  href,
  ...props
}) {
  const classes = joinClasses(baseClasses, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
