import { renderWithProviders } from "../../test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitch from "./LanguageSwitch";
import { describe, it, expect, beforeEach } from "vitest";
import i18n from "../../i18n";

describe("LanguageSwitch Component", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders with current language code", () => {
    renderWithProviders(<LanguageSwitch />);
    // "EN" should be visible on desktop view
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitch />);
    const button = screen.getByLabelText("Language");

    await user.click(button);

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
  });

  it("changes language when an option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitch />);
    const button = screen.getByLabelText("Language");

    await user.click(button); // Open
    await user.click(screen.getByText("Tiếng Việt")); // Select

    expect(i18n.language).toBe("vi");
  });

  it("closes dropdown when overlay is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<LanguageSwitch />);
    const button = screen.getByLabelText("Language");

    await user.click(button);

    // Check if dropdown is present
    expect(screen.queryByText("Tiếng Việt")).toBeInTheDocument();

    // Click the overlay
    const overlay = container.querySelector(".fixed.inset-0");
    if (overlay) {
      await user.click(overlay);
    } else {
      throw new Error("Overlay not found");
    }

    // Dropdown items should be gone
    expect(screen.queryByText("Tiếng Việt")).not.toBeInTheDocument();
  });

  it("defaults to first supported language if current language is unsupported", async () => {
    await i18n.changeLanguage("fr");
    renderWithProviders(<LanguageSwitch />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    // It should pick "EN" since it's the fallback for "fr" or the default in support list
  });
});
