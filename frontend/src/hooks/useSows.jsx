// frontend/src/hooks/useSows.jsx

import { useState, useEffect } from "react";
import { sowAPI } from "../api/sow.api";
import { toast } from "react-hot-toast";

export const useSOWs = () => {
  const [sows, setSOWs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSOWs = async () => {
    setLoading(true);
    try {
      const data = await sowAPI.getAll();
      setSOWs(data);
    } catch (err) {
      toast.error("Failed to fetch SOWs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSOW = async (sowData) => {
    try {
      const newSow = await sowAPI.create(sowData);
      setSOWs((prev) => [...prev, newSow]);
      return newSow;
    } catch (err) {
      toast.error("Failed to create SOW.");
      throw err;
    }
  };

  const updateSOW = async (id, updatedData) => {
    try {
      const updated = await sowAPI.update(id, updatedData);
      setSOWs((prev) => prev.map((sow) => (sow._id === id ? updated : sow)));
      return updated;
    } catch (err) {
      toast.error("Failed to update SOW.");
      throw err;
    }
  };

  const getSOW = async (id) => {
    try {
      return await sowAPI.getById(id);
    } catch (err) {
      toast.error("Failed to retrieve SOW.");
      throw err;
    }
  };

  return {
    sows,
    loading,
    fetchSOWs,
    addSOW,
    updateSOW,
    getSOW,
  };
};
