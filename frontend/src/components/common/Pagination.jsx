import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPaginationGroup = () => {
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);
        const pageNumbers = [1];

        if (currentPage > 3) {
            pageNumbers.push('...');
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push('...');
        }
        
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
        
        // Remove duplicates that can occur at edges, like [1, '...', 2, 3] should be [1, 2, 3]
        return [...new Set(pageNumbers)];
    };


    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">
                        Showing
                        <span className="font-medium mx-1 text-white">{(currentPage - 1) * itemsPerPage + 1}</span>
                        to
                        <span className="font-medium mx-1 text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                        of
                        <span className="font-medium mx-1 text-white">{totalItems}</span>
                        results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {getPaginationGroup().map((item, index) => (
                            <button
                                key={index}
                                onClick={() => typeof item === 'number' && onPageChange(item)}
                                disabled={item === '...'}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium
                                    ${
                                        item === '...'
                                            ? 'bg-gray-800 text-gray-400'
                                            : currentPage === item
                                            ? 'z-10 bg-emerald-600 border-emerald-500 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }
                                `}
                            >
                                {item}
                            </button>
                        ))}
                        
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};