import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitch from "./LanguageSwitch";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockChangeLanguage = vi.fn();
let mockLanguage = "en";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() {
        return mockLanguage;
      },
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe("LanguageSwitch Component", () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    mockLanguage = "en";
  });

  it("renders with current language code", () => {
    render(<LanguageSwitch />);
    // "EN" should be visible on desktop view
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    render(<LanguageSwitch />);
    const button = screen.getByLabelText("common.language");

    fireEvent.click(button);

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
  });

  it("changes language when an option is selected", () => {
    render(<LanguageSwitch />);
    const button = screen.getByLabelText("common.language");

    fireEvent.click(button); // Open
    fireEvent.click(screen.getByText("Tiếng Việt")); // Select

    expect(mockChangeLanguage).toHaveBeenCalledWith("vi");
  });

  it("closes dropdown when overlay is clicked", () => {
    const { container } = render(<LanguageSwitch />);
    const button = screen.getByLabelText("common.language");

    fireEvent.click(button);

    // Check if dropdown is present
    expect(screen.queryByText("Tiếng Việt")).toBeInTheDocument();

    // Click the overlay
    const overlay = container.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
    } else {
      throw new Error("Overlay not found");
    }

    // Dropdown items should be gone
    expect(screen.queryByText("Tiếng Việt")).not.toBeInTheDocument();
  });

  it("defaults to first supported language if current language is unsupported", () => {
    mockLanguage = "fr";
    render(<LanguageSwitch />);
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});
