// frontend/src/components/ui/pagination.jsx

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./Button.jsx";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  theme = "company",
  showPageNumbers = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {showPageNumbers && (
          <>
            {/* First Page */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant={currentPage === 1 ? "primary" : "ghost"}
                  theme={theme}
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 min-w-[2rem]"
                >
                  1
                </Button>
                {showLeftEllipsis && (
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                )}
              </>
            )}

            {/* Visible Pages */}
            {visiblePages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "ghost"}
                theme={theme}
                onClick={() => onPageChange(page)}
                className="px-3 py-1 min-w-[2rem]"
              >
                {page}
              </Button>
            ))}

            {/* Last Page */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {showRightEllipsis && (
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                )}
                <Button
                  variant={currentPage === totalPages ? "primary" : "ghost"}
                  theme={theme}
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 min-w-[2rem]"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </>
        )}

        {/* Next Button */}
        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};