import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Suppress the i18next Locize advertisement in test output
const silenceLocize = (original: (...args: unknown[]) => void) => (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("i18next is made possible by")
  ) {
    return;
  }
  original(...args);
};

console.log = silenceLocize(console.log);
console.info = silenceLocize(console.info);
