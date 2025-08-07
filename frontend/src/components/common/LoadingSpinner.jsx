import React from 'react';

/**
 * A simple, centered loading spinner component.
 * It uses Tailwind's `animate-spin` utility for the animation.
 */
export const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center p-12" role="status" aria-label="Loading">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};