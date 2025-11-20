import type {ComponentProps} from 'react';

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
};

const variants = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 focus:ring-[var(--color-primary)]',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400',
    ghost: 'bg-transparent text-[var(--color-foreground)] hover:bg-gray-200 dark:hover:bg-gray-700',
};

const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'h-10 w-10',
};

export function Button({children, variant = 'primary', size = 'md', className, ...props}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = variants[variant];
    const sizeClasses = sizes[size];

    return (
        <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
            {children}
        </button>
    );
}