// src/components/auth/PhoneInput.js
"use client";

import { Controller, useFormContext } from "react-hook-form"; // Import necessary RHF hooks
import { useState } from "react";
import { useCountryCodes } from "@/src/hooks/useCountryCodes";
import CountryCodeSkeleton from "../skeletons/CountryCodeSkeleton";

const PhoneInput = () => {
  const { data: countryCodes, isLoading } = useCountryCodes();
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Get RHF context

  // State to hold the selected dial code prefix, defaulting to a common one
  const [selectedDialCode, setSelectedDialCode] = useState("+1");

  // Find the initial country for the selected dial code to display its flag/name
  const initialCountry = countryCodes.find(
    (c) => c.dialCode === selectedDialCode
  );

  if (isLoading) {
    // Show the skeleton while data is fetching
    return <CountryCodeSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor="phoneNumber"
        className="text-sm font-medium dark:text-gray-300"
      >
        Phone Number
      </label>
      <div className="flex rounded-lg border dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow overflow-hidden">
        {/* Country Code Dropdown */}
        <div className="relative border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <select
            value={selectedDialCode}
            onChange={(e) => setSelectedDialCode(e.target.value)}
            className="appearance-none block w-full bg-transparent text-gray-800 dark:text-gray-200 py-3 pl-3 pr-8 text-base focus:outline-none cursor-pointer"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {`${country.dialCode} (${country.code})`}
              </option>
            ))}
          </select>
          {/* Custom Dropdown Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Phone Number Input controlled by react-hook-form */}
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="phoneNumber"
              type="tel"
              placeholder="e.g., 555-123-4567"
              className={`flex-grow block w-full border-0 focus:ring-0 py-3 px-4 dark:bg-gray-900 dark:text-gray-100 placeholder-gray-500
                ${errors.phoneNumber ? "ring-red-500 border-red-500" : ""}`}
            />
          )}
        />
      </div>

      {/* Display error message */}
      {errors.phoneNumber && (
        <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
      )}

      {/* Hidden field to combine code and number for validation later */}
      <Controller
        name="fullPhoneNumber"
        control={control}
        defaultValue={selectedDialCode}
        render={({ field }) => (
          <input
            type="hidden"
            {...field}
            value={selectedDialCode + control._formValues.phoneNumber}
          />
        )}
      />
    </div>
  );
};

export default PhoneInput;
