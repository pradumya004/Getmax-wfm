// frontend/src/hooks/useSearch.jsx

import { useState, useMemo, useEffect } from "react";
import { filterData } from "../lib/utils.js";

export const useSearch = (data, searchFields = ["name"], debounceMs = 300) => {
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔁 Debounce using useEffect instead of debounce function
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(inputTerm);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [inputTerm, debounceMs]);

  const filteredData = useMemo(() => {
    return filterData(data, searchTerm, searchFields);
  }, [data, searchTerm, searchFields]);

  return {
    searchTerm: inputTerm,
    setSearchTerm: setInputTerm,
    filteredData,
    hasResults: filteredData.length > 0,
    totalResults: filteredData.length,
  };
};
