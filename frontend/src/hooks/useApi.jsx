// frontend/src/hooks/useApi.jsx

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      const lastArg = args[args.length - 1];
      const options =
        typeof lastArg === "object" && lastArg?.silent !== undefined
          ? args.pop()
          : {};
      const silent = options.silent;

      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);

        if (result?.success) {
          const innerData = result.data?.data ?? result.data;
          setData(innerData);
          return innerData;
        } else {
          console.error("❌ API failed response:", result); // <-- Add this
          const errMsg =
            result?.message || result?.error || "Unknown error occurred";
          !silent && toast.error(errMsg);
          setError(errMsg);
          return null;
        }
      } catch (err) {
        console.error("❌ Full API Exception:", err); // <-- Add this
        const errMsg = err?.message || "Unexpected error";
        !silent && toast.error("Something went wrong");
        setError(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};
