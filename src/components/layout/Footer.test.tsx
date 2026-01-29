import { test, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Footer", () => {
  test("renders footer with translated title", () => {
    render(<Footer />);
    const title = screen.getByText(/header.titleShort/);
    expect(title).toBeInTheDocument();
  });

  test("renders footer with translated description", () => {
    render(<Footer />);
    const description = screen.getByText(/footer.description/);
    expect(description).toBeInTheDocument();
  });

  test("renders footer with author link", () => {
    render(<Footer />);
    const authorLink = screen.getByRole("link", { name: /footer.author/ });
    expect(authorLink).toHaveAttribute("href", "https://github.com/johncegom");
  });
});
