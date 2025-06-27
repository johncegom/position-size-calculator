import { test, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Footer", () => {
  test("renders footer with translated text and author link", () => {
    render(<Footer />);
    expect(screen.getByText(/footer.title/)).toBeInTheDocument();
    expect(screen.getByText(/footer.description/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /footer.author/ })).toHaveAttribute(
      "href",
      "https://github.com/johncegom"
    );
  });
});
