import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const autoComplete = props.autoComplete ?? getDefaultAutoComplete(props.type, label);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}
            sr-input-base ${error ? 'sr-input-error' : ''}
            rounded-xl
            sr-focus-ring
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

function getDefaultAutoComplete(type: InputProps['type'], label?: string): string {
  const normalizedLabel = (label || '').toLowerCase();

  if (type === 'email') return 'email';
  if (type === 'tel') return 'tel-national';

  if (type === 'password') {
    if (normalizedLabel.includes('new') || normalizedLabel.includes('create') || normalizedLabel.includes('signup')) {
      return 'new-password';
    }
    return 'current-password';
  }

  if (normalizedLabel.includes('name')) return 'name';

  return 'off';
}
