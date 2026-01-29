import { test, expect, describe, vi, beforeEach } from "vitest";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  processFormValues,
} from "./utils";

describe("utils", () => {
  describe("localStorage utilities", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    test("saveToLocalStorage stores value with version wrapper", () => {
      const key = "testKey";
      const value = "testValue";
      const result = saveToLocalStorage(key, value);

      expect(result).toBe(true);
      const stored = JSON.parse(localStorage.getItem(key)!);
      expect(stored).toEqual({
        version: "v1",
        value: value,
      });
    });

    test("saveToLocalStorage returns false and doesn't store if value is 'null'", () => {
      const result = saveToLocalStorage("key", "null");
      expect(result).toBe(false);
      expect(localStorage.getItem("key")).toBeNull();
    });

    test("loadFromLocalStorage retrieves value if version matches", () => {
      const key = "testKey";
      const item = { version: "v1", value: "savedValue" };
      localStorage.setItem(key, JSON.stringify(item));

      expect(loadFromLocalStorage(key)).toBe("savedValue");
    });

    test("loadFromLocalStorage returns null if version mismatch", () => {
      const key = "testKey";
      const item = { version: "v99", value: "savedValue" };
      localStorage.setItem(key, JSON.stringify(item));

      expect(loadFromLocalStorage(key)).toBeNull();
    });

    test("loadFromLocalStorage returns null if item doesn't exist", () => {
      expect(loadFromLocalStorage("nonExistent")).toBeNull();
    });

    test("loadFromLocalStorage parses legacy raw strings", () => {
      const key = "legacyKey";
      localStorage.setItem(key, "rawStringValue");
      expect(loadFromLocalStorage(key)).toBe("rawStringValue");
    });

    test("loadFromLocalStorage handles invalid JSON by returning raw value", () => {
      const key = "invalidJson";
      localStorage.setItem(key, "{ invalid json }");
      expect(loadFromLocalStorage(key)).toBe("{ invalid json }");
    });
  });

  describe("processFormValues", () => {
    test("calls handleParam with numeric values", () => {
      const formValues = {
        totalCapital: "1000",
        entryPrice: "50000.5",
      };
      const results: Record<string, number | null> = {};
      const handleParam = (name: string, val: number | null) => {
        results[name] = val;
      };

      processFormValues(formValues, handleParam);

      expect(results.totalCapital).toBe(1000);
      expect(results.entryPrice).toBe(50000.5);
    });

    test("handles empty string for takeProfitPrice as null", () => {
      const formValues = {
        takeProfitPrice: "",
      };
      let result: number | null = 123;
      const handleParam = (_: string, val: number | null) => {
        result = val;
      };

      processFormValues(formValues, handleParam);
      expect(result).toBeNull();
    });

    test("handles empty string for other fields as 0", () => {
      const formValues = {
        totalCapital: "",
      };
      let result: number | null = 123;
      const handleParam = (_: string, val: number | null) => {
        result = val;
      };

      processFormValues(formValues, handleParam);
      expect(result).toBe(0);
    });
  });
});
