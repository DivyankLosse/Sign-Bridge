import React from 'react';

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

export default function Input({
  id,
  label,
  error,
  hint,
  className = '',
  inputClassName = '',
  ...props
}) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={joinClasses('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-semibold text-ink" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-describedby={messageId}
        aria-invalid={error ? 'true' : undefined}
        className={joinClasses(
          'block w-full rounded-lg border bg-surface px-4 py-3 text-base text-ink placeholder:text-subtle shadow-none transition duration-200',
          'border-outline hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
          error && 'border-danger bg-danger-soft focus:border-danger focus:ring-danger/25',
          inputClassName,
        )}
        id={id}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-danger" id={messageId}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-sm text-muted" id={messageId}>
          {hint}
        </p>
      )}
    </div>
  );
}
