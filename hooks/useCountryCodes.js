// src/hooks/useCountryCodes.js
import { useState, useEffect } from "react";

// Define the API URL
const REST_COUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags";

/**
 * Custom hook to fetch and parse country codes for phone inputs.
 * @returns {{ data: Array, isLoading: boolean, error: string | null }}
 */
export const useCountryCodes = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(REST_COUNTRIES_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch country data");
        }
        const json = await response.json();

        // Process the raw data into the required format: { name, code, flag, dialCode }
        const parsedData = json
          .map((country) => {
            // Some countries might have an empty root or suffixes, we need a clean code
            const root = country.idd.root;
            const suffix =
              country.idd.suffixes && country.idd.suffixes.length > 0
                ? country.idd.suffixes[0]
                : "";
            const dialCode =
              root && root.length > 0 ? `${root}${suffix}` : null;

            if (!dialCode) return null; // Skip if no valid dial code

            return {
              name: country.name.common,
              code: country.cca2, // ISO 3166-1 alpha-2 code
              flag: country.flags.svg,
              dialCode: dialCode,
            };
          })
          .filter(Boolean) // Remove null entries
          .sort((a, b) => a.dialCode.localeCompare(b.dialCode)); // Sort by dial code

        // Remove duplicates and prioritize unique dial codes (e.g., US/CA both have +1)
        const uniqueDialCodes = {};
        parsedData.forEach((item) => {
          if (!uniqueDialCodes[item.dialCode]) {
            uniqueDialCodes[item.dialCode] = item;
          }
        });

        setData(Object.values(uniqueDialCodes));
      } catch (err) {
        console.error("Error fetching country codes:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { data, isLoading, error };
};
