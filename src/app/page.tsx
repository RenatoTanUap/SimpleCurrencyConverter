"use client";
import { useEffect, useState } from "react";
import { CurrencyCard } from "./components/currency-card";
import { UseConvert } from "./hooks/use-convert";
import { UseCurrency } from "./hooks/use-currency";
import RightArrow from "./svg/right-arrow";

export default function Home() {
  // I made a distinction between the left and right values of the two cards shown to the user in the main page
  // because the user can switch from converting the values from left to right and vice versa.
  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(0);
  const [selectedCurrencyLeft, setSelectedCurrencyLeft] = useState<string>("");
  const [selectedCurrencyRight, setSelectedCurrencyRight] =
    useState<string>("");
  // Boolean for the direction of conversion
  const [reverse, setReverse] = useState(false);

  // Hook for fetching the Currency Options shown to the user in the dropdown selection
  const { currencies, fetchCurrencyError, fetchCurrencyLoading } =
    UseCurrency();
  // Hook which includes the function that calls the conversion api endpoint from fastforex
  const { convert, convertedValue, convertingError, convertLoading } =
    UseConvert();

  const error = fetchCurrencyError || convertingError;
  const loading = fetchCurrencyLoading || convertLoading;

  // This useEffect calls the conversion function everytime the user
  // 1. Selects a currency option from both cards
  // 2. Inputs a number value in the available number input
  // 3. Changes a currency option in one of the cards
  useEffect(
    () => {
      const convertValues = async () => {
        // This basically flips the params given to the conversion function based on the set direction of conversion (L->R/R->L)
        const conversionParams = {
          // From is the base currency
          from: !reverse ? selectedCurrencyLeft : selectedCurrencyRight,
          // To is the destination currency for conversion
          to: !reverse ? selectedCurrencyRight : selectedCurrencyLeft,
          // Money value
          amount: !reverse ? leftValue.toString() : rightValue.toString(),
        };
        await convert(conversionParams);
      };

      // If statement checks if both currency options have been chosen,
      // and checks ONLY leftValue or ONLY rightValue, depending on the set direction of conversion
      if (
        (reverse ? rightValue : leftValue) &&
        selectedCurrencyLeft &&
        selectedCurrencyRight
      )
        convertValues();
    },
    // The ternary here is similar to the if-statement above
    // Only update useEffect based on rightValue/leftValue based on the set direction of conversion
    [
      reverse ? rightValue : leftValue,
      selectedCurrencyLeft,
      selectedCurrencyRight,
    ]
  );

  // Everytime a value has been successfully converted, this useEffect will update the corresponding card
  useEffect(() => {
    if (convertedValue) {
      if (reverse) {
        setLeftValue(convertedValue);
      } else {
        setRightValue(convertedValue);
      }
    }
  }, [convertedValue]);

  return (
    <div className="flex flex-col w-full h-full">
      <title>Currency Converter</title>
      <main className="flex flex-col w-full h-full flex-wrap justify-center items-center h-svh">
        <label className="text-6xl mt-16">Currency Converter</label>
        <div className="flex flex-1 flex-row w-full justify-center items-center gap-6">
          <CurrencyCard
            value={leftValue}
            onChangeValue={setLeftValue}
            currencyOptions={currencies}
            currency={selectedCurrencyLeft}
            onChangeCurrency={(option) => {
              setSelectedCurrencyLeft(option);
            }}
            isBase={!reverse}
            loading={loading}
          />
          <div
            className="flex flex-wrap content-center"
            onClick={() => {
              setReverse((v) => !v);
            }}
          >
            <RightArrow flip={reverse} />
          </div>
          <CurrencyCard
            value={rightValue}
            onChangeValue={setRightValue}
            currencyOptions={currencies}
            currency={selectedCurrencyRight}
            onChangeCurrency={(option) => {
              setSelectedCurrencyRight(option);
            }}
            isBase={reverse}
            loading={loading}
          />
        </div>
        {error ? (
          <div className="text-white text-4xl pb-8">{`There was a problem: ${fetchCurrencyError}`}</div>
        ) : null}
      </main>
    </div>
  );
}
