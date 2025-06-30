import { cn } from '../../lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				gradient: 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white hover:from-blue-800 hover:via-purple-800 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
				'gradient-outline': 'relative bg-transparent text-transparent bg-clip-text bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-2 border-transparent hover:border-blue-500/50 before:absolute before:inset-0 before:rounded-md before:p-[2px] before:bg-gradient-to-br before:from-blue-900 before:via-purple-900 before:to-indigo-900 before:-z-10 before:opacity-20 hover:before:opacity-40 before:transition-opacity',
				'gradient-soft': 'bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 text-blue-900 hover:from-blue-200 hover:via-purple-100 hover:to-indigo-200 border border-blue-200/50 shadow-sm hover:shadow-md',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3 text-xs',
				lg: 'h-11 rounded-md px-8 text-base',
				xl: 'h-12 rounded-lg px-10 text-lg',
				icon: 'h-10 w-10',
				'icon-sm': 'h-8 w-8',
				'icon-lg': 'h-12 w-12',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});

Button.displayName = 'Button';

export { Button, buttonVariants };