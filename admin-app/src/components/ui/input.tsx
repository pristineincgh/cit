import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  helperText?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, helperText, error, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            `flex h-10 w-full rounded-md border border-input bg-background px-3 py-6 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              error
                ? 'border-red-500 text-red-500 placeholder:text-red-300'
                : ''
            }`,
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <>
            <span
              className={`${
                error ? 'text-red-500 text-sm' : 'text-muted-foreground text-sm'
              }`}
            >
              {helperText}
            </span>
          </>
        )}
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };
