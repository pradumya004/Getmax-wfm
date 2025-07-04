// frontend/src/components/common/FilterPanel.jsx

import React, { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import { Badge } from "../ui/Badge.jsx";

export const FilterPanel = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  theme = "company",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    onFilterChange({
      ...activeFilters,
      [filterKey]: value,
    });
  };

  const handleClearFilter = (filterKey) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    onFilterChange(newFilters);
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        theme={theme}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="success" className="ml-2">
            {activeFilterCount}
          </Badge>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <Card
          theme={theme}
          className="absolute top-full left-0 mt-2 p-4 min-w-80 z-50"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Filters</h3>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={onClearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm"
                    >
                      <span>
                        {key}: {value}
                      </span>
                      <button
                        onClick={() => handleClearFilter(key)}
                        className="hover:bg-blue-500/30 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Options */}
            <div className="space-y-3">
              {filters.map((filter) => (
                <Select
                  key={filter.key}
                  label={filter.label}
                  value={activeFilters[filter.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  options={filter.options}
                  placeholder={`Select ${filter.label.toLowerCase()}...`}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};