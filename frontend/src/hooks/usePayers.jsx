import { useState, useEffect } from "react";
import { payerAPI } from "../api/payer.api";
import { useApi } from "./useApi"; // ensure this exists

export const usePayers = () => {
  const [payers, setPayers] = useState([]);
  const {
    loading,
    error,
    execute: fetchAllPayers,
  } = useApi(payerAPI.getAllPayers);

  useEffect(() => {
    fetchPayers();
  }, []);

  const fetchPayers = async () => {
    console.log("Fetching payers...");
    try {
      const res = await fetchAllPayers();
      console.log("Payers Response In usePayers:", res);

      setPayers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch payers", err);
    }
  };

  return { payers, loading, error, refresh: fetchPayers };
};
