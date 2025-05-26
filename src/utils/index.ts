export const saveToLocalStorage = (paramName: string, value: string): void => {
  if (value !== "null") localStorage.setItem(paramName, value);
};

export const loadFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};
