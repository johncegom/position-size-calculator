# 📊 Position Size Calculator

A modern React + TypeScript app for traders to calculate optimal position sizes using robust risk management. Powered by Redux Toolkit and TailwindCSS.

---

## 🚀 Quick Start

```sh
git clone https://github.com/your-username/position-size-calculator.git
cd position-size-calculator
npm install
npm run dev
```

---

## 🧩 Features

- **Position Size Calculation**: Based on capital, entry, stop-loss, take-profit, and risk %.
- **Risk/Reward Visualization**: Dynamic charts and progress bars.
- **Redux State Management**: Global state, persistent settings, and input history.
- **Internationalization**: Multi-language support (EN, VI).
- **Responsive UI**: Mobile-first, TailwindCSS-powered.
- **Local Storage Persistence**: Remembers your preferences and last-used values.
- **Trade Outcome Simulation**: Visualize profit/loss scenarios.
- **Extensible**: Modular codebase for easy feature addition.

---

## 🛠️ Tech Stack

- [React 19](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 🗂️ Project Structure

```
src/
├── components/      # UI components (layout, calculator, common)
├── hooks/           # Custom React hooks
├── pages/           # Page components (Home, etc.)
├── store/           # Redux slices and store setup
├── types/           # TypeScript types/interfaces
├── utils/           # Calculation and formatting helpers
└── locales/         # i18n translation files
```

---

## 🧪 Formula

```
Position Size = (Capital × Risk %) ÷ |Entry Price - Stop Loss Price|
```

Example:

- Capital = $10,000
- Risk % = 2%
- Entry = $100
- SL = $95

Result: `(10,000 × 0.02) / 5 = 40 units`

---

## 🧑‍💻 For Developers

- **Add a new input:** Edit `CalculatorForm.tsx`, update Redux slice, extend types.
- **Change calculation logic:** Update `utils/calculations.ts`.
- **Add a feature:** Scaffold a new component in `components/`, connect to Redux if needed.
- **Testing:** See below for test instructions.
- **Contributions:** PRs welcome! Please open an issue first for major changes.

---

## 🧪 Running Tests

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

### 1. Install dependencies

```sh
npm install
```

### 2. Run all tests

```sh
npm test
```

or

```sh
npx vitest
```

### 3. Watch mode (recommended for development)

```sh
npx vitest --watch
```

### 4. View test coverage

```sh
npx vitest run --coverage
```

The coverage report will be available in the `coverage/` folder.

---

## 🌐 Internationalization

- Easily add new languages in `src/locales/`.
- Language switcher in the UI.

---

## 📄 License

MIT

---

> **Tip:** For detailed feature roadmap and tasks, see [Feature Tasks.md](Feature%20Tasks.md).
