"use client";

import { useState } from "react";

interface ConvertParams {
  from: string;
  to: string;
  amount: string;
}

interface UseConvertProps {
  convertedValue: number | null;
  convertLoading: boolean;
  convertingError: string | null;
  convert: (params: ConvertParams) => Promise<void>;
}

export const UseConvert = (): UseConvertProps => {
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertingError, setConvertingError] = useState<string | null>(null);

  const convert = async ({ from, to, amount }: ConvertParams) => {
    setConvertLoading(true);
    try {
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };
      /** Convert given amount from base currency to target currency
       * Example response:
       * {
       * amount: 10,
       * base: "USD",
       * result: {
       *    PHP: 578.53,
       *    rate: 57.8526,
       *  }
       * }
       */
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/convert?api_key=${process.env.NEXT_PUBLIC_API_KEY}&from=${from}&to=${to}&amount=${amount}`,
        options
      );
      if (!res.ok) throw new Error("Failed to fetch currencies");
      const data = await res.json();
      // Get values of the result object in response which holds: [converted value, conversion rate]
      const value = Object.values(data.result)[0] as number;
      if (!isNaN(value)) setConvertedValue(value);
      setConvertLoading(false);
    } catch (err) {
      setConvertingError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setConvertLoading(false);
    }
  };

  return { convert, convertedValue, convertingError, convertLoading };
};
