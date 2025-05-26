# 📊 Position Size Calculator

A modern, responsive React + TypeScript application that helps traders calculate the optimal position size per trade based on capital, risk tolerance, and price levels. Built with Redux Toolkit for scalable state management.

---

## 🎯 Purpose

Many traders struggle to determine how much capital to risk per trade. This tool streamlines that decision by using proven risk management formulas. It provides a simple yet effective interface for consistently determining position sizes.

---

## 🧩 Problem It Solves

- Manual risk calculations using spreadsheets or calculators
- Mismanagement of capital due to inconsistent sizing
- Lack of visualization of risk-reward profiles

---

## 👤 Target Audience

- Retail and beginner traders
- Professional traders needing a lightweight calculator
- Trading educators

---

## 🛠️ Features

### Core Calculator

- Inputs:
  - Capital
  - Entry Price
  - Stop-Loss Price
  - Take-Profit Price (optional)
  - Risk Percentage
- Output:
  - Position Size (in units/contracts)
  - Dollar amount at risk
  - Risk-to-Reward ratio

### Trade Journal Integration

- Save calculated trades to personal journal
- Track actual execution vs. planned parameters
- Performance analytics dashboard
- Win/loss tracking with visual reports
- Strategy performance comparison
- Export functionality for external analysis

### Settings & Preferences

- Save default risk % and capital using Redux
- Optional leverage input
- Light/Dark mode toggle

### State Management (Redux)

- Store input values and settings globally
- LocalStorage middleware for persistence
- Slice separation: calculatorSlice, themeSlice, journalSlice

### Responsive UI

- Built with TailwindCSS
- Mobile-first design
- Clean layout using layout components

### Utility Functions

- Modular calculation logic in /utils
- Includes validation helpers and number formatters

---

## 💻 Tech Stack

- React 19
- Redux Toolkit
- TypeScript
- TailwindCSS 4
- Vite

---

## 🧪 Formula

```ts
Position Size = (Capital × Risk %) ÷ |Entry - Stop Loss|
```

Example:

```txt
Capital = $10,000
Risk % = 2%
Entry = $100
SL = $95

=> (10,000 * 0.02) / 5 = 40 units
```

---

## 🗂️ Project Structure

```sh
src/
├── components/
│   ├── layout/            # Header, Footer
│   └── calculator/        # Form, results
├── hooks/                # useCalculator, useSettings
├── pages/                # Home.tsx
├── redux/                # store.ts, calculatorSlice.ts, themeSlice.ts
├── types/                # Shared types
├── utils/                # Calculation helpers
└── assets/               # Icons, logos
```

---

## 🚀 Developer Guide

### 1. Clone and Install

```bash
git clone https://github.com/your-username/position-size-calculator.git
cd position-size-calculator
npm install
```

### 2. Run the Dev Server

```bash
npm run dev
```

### 3. Key Development Tasks

#### Add New Input Field

- Edit CalculatorForm.tsx
- Update calculatorSlice.ts for Redux state
- Extend types in /types

#### Update Calculation Logic

- Modify /utils/calculatePositionSize.ts
- Ensure all edge cases (e.g., SL = Entry)

#### Add Theme Toggle

- Create themeSlice in /redux
- Use Tailwind's dark mode support

#### Add Persistence

- Use redux-persist or custom localStorage middleware

---

## 🔮 Roadmap

- ✅ Basic calculator (capital, SL, TP, risk %)
- 🔄 Redux-powered state
- 📁 Save/load trade setups
- 📊 Add trade outcome simulation
- 🌐 Multi-currency support
- ☁️ Firebase sync (optional login)

---

## 🪪 License

MIT — Free to use, modify, and distribute.
