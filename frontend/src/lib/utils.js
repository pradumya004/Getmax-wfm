// frontend/src/lib/utils.js

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge class names with Tailwind CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', hour12: true }
  };

  const formatOptions = options[format] || options['short'];

  return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generate status color classes
export const getStatusColor = (status) => {
  const colors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    inactive: "bg-red-500/20 text-red-400 border-red-500/30",
    suspended: "bg-red-500/20 text-red-400 border-red-500/30",
    trial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

  return colors[status?.toLowerCase()] || colors.pending;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Search/filter helper
export const filterData = (data, searchTerm, searchFields = ['name']) => {
  if (!searchTerm) return data;

  return data.filter(item =>
    searchFields.some(field =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};