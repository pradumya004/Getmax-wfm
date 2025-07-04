// frontend/src/hooks/useApi.jsx

// frontend/src/hooks/useApi.jsx
import { useState, useCallback } from 'react';

export const useApi = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiFunction(...args);

            if (result.success) {
                const innerData = result.data?.data ?? result.data;
                setData(innerData);
                return innerData;
            } else {
                setError(result.error);
                return null;
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
};