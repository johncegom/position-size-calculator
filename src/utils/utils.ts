/**
 * Saves a string value to the browser's localStorage under the specified parameter name.
 *
 * @param paramName - The key under which the value will be stored in localStorage.
 * @param value - The string value to store. If the value is the string "null", the function will not save it and will return false.
 * @returns Returns `true` if the value was successfully saved, or `false` if the value was "null".
 */
export const saveToLocalStorage = (
  paramName: string,
  value: string
): boolean => {
  if (value === "null") return false;
  localStorage.setItem(paramName, value);
  return true;
};

/**
 * Retrieves a value from the browser's local storage by the specified key.
 *
 * @param key - The key of the item to retrieve from local storage.
 * @returns The value associated with the given key, or `null` if the key does not exist.
 */
export const loadFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

/**
 * Processes form values by converting string values to numbers or null, then passes them to a handler function.
 *
 * Iterates over each entry in the provided `formValues` object, parses the string value to a number,
 * or assigns `null` for the "takeProfitPrice" parameter if the value is an empty string.
 * For other parameters with empty string values, assigns `0`.
 * Calls the `handleParam` callback with the parameter name and the processed value.
 *
 * @param formValues - An object mapping parameter names to their string values from the form.
 * @param handleParam - A callback function that receives the parameter name and its processed numeric or null value.
 */
export const processFormValues = (
  formValues: Record<string, string>,
  handleParam: (paramName: string, value: number | null) => void
) => {
  Object.entries(formValues).forEach(([paramName, strValue]) => {
    const isOptionalTakeProfit = paramName === "takeProfitPrice";
    const numericValue =
      strValue === ""
        ? isOptionalTakeProfit
          ? null
          : 0
        : parseFloat(strValue);

    handleParam(paramName, numericValue);
  });
};
