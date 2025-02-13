import { useEffect, useState } from "react";

interface UseCurrencyProps {
  currencies: {
    [key: string]: string;
  };
  fetchCurrencyError: string | null;
  fetchCurrencyLoading: boolean;
}

export const UseCurrency = (): UseCurrencyProps => {
  const [currencies, setCurrencies] = useState<{}>([]);
  const [fetchCurrencyLoading, setFetchCurrencyLoading] = useState(true);
  const [fetchCurrencyError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const options = {
          method: "GET",
          headers: { accept: "application/json" },
        };
        /* Fetch all currencies from fastforex
        Example of response:
        {
        currencies: {
            USD: "United States Dollar"
          },
        }
        */
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/currencies?api_key=${process.env.NEXT_PUBLIC_API_KEY}`,
          options
        );
        if (!res.ok) throw new Error("Failed to fetch currencies");
        const data = await res.json();
        setCurrencies(data.currencies);
        setFetchCurrencyLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setFetchCurrencyLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, fetchCurrencyError, fetchCurrencyLoading };
};
