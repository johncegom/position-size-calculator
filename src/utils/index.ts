export const saveToLocalStorage = (
  paramName: string,
  value: string
): boolean => {
  if (value === "null") return false;
  localStorage.setItem(paramName, value);
  return true;
};

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
