"use client";

import { useState } from "react";

interface CurrencyCardParams {
  value: number;
  currencyOptions: {
    [key: string]: string;
  };
  currency: string;
  onChangeCurrency: (option: string) => void;
  onChangeValue: (value: number) => void;
  isBase?: boolean;
  loading?: boolean;
}

export const CurrencyCard = ({
  value,
  currencyOptions,
  currency,
  onChangeCurrency,
  onChangeValue,
  isBase,
  loading,
}: CurrencyCardParams) => {
  const [isOpen, setIsOpen] = useState(false);
  // The keys of the response from fastforex is formatted as {[country_code]: [full_currency_name]}
  // So the options shown in the dropdown menu is only the 3 letter country code
  const options = Object.keys(currencyOptions);

  if (loading) {
    return (
      <div className="max-w-sm h-min rounded-2xl overflow-hidden shadow-lg bg-white p-5 border border-gray-200 text-black text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-sm h-min rounded-2xl overflow-hidden shadow-lg bg-white p-5 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">
        {currency !== "" ? currencyOptions[currency] : "Select a Currency"}
      </h2>
      <div className="w-full text-black">
        <div
          className="w-full p-2 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer bg-white hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{currency ? currency : "Select"}</span>
        </div>
        {isOpen && (
          <ul className="relative w-full bg-white rounded-lg mt-1 shadow-lg z-10 overflow-scroll no-scrollbar max-h-[300px]">
            {options.map((option, index) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
                onClick={() => {
                  onChangeCurrency(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-2 text-black">
        {isBase ? (
          <label className="text-gray-700" htmlFor="number">
            Enter a number:
          </label>
        ) : (
          <div className="h-[1.5rem]"></div>
        )}
        <input
          id="number"
          type="number"
          step={0.1}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a value..."
          value={value}
          disabled={isBase ? !isBase : true}
          onChange={(event) => {
            // Ensure only number input
            const value = parseFloat(event.target.value);
            if (!isNaN(value)) onChangeValue(value);
          }}
        />
      </div>
    </div>
  );
};
