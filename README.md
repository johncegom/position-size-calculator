# 📊 Position Size Calculator

A professional, fintech-grade React + TypeScript application designed for traders to calculate optimal position sizes using robust risk management principles.

---

## 🚀 Key Simulations & Features

- **Optimal Position Sizing**: Calculates the exact **Notional Value** you should allocate based on your risk appetite and trade geometry.
- **Account Growth Projection**: A dynamic simulator that visualizes how your account balance evolves over time based on win rate, risk/reward, and compounding.
- **Risk/Reward Scenarios**: Instantly see your potential Profit/Loss across different R:R targets (1:1, 1:2, 1:3, etc.) tailored to your entry.
- **Premium Fintech UI**: Modern "Glassmorphism" interface with full Dark/Light mode support, featuring a custom design system built with Tailwind CSS v4.
- **Internationalization (i18n)**: Native support for English and Vietnamese, including localized numeric formatting.
- **Responsive & Persistent**: Mobile-first design that remembers your settings (Capital, Risk %) via Local Storage for a seamless workflow.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the latest JIT and design system features)
- **Runtime/Bundler**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) with high coverage on core calculation utilities.
- **Languages**: [i18next](https://www.i18next.com/)

---

## 🧩 Project Structure

```
src/
├── components/
│   ├── calculator/   # Primary logic components (Form, Result, Visuals, Simulators)
│   ├── layout/       # Global Header, Footer with glassmorphism
│   └── common/       # Reusable UI elements (Buttons, Switches)
├── store/            # Redux slices and persistence logic
├── locales/          # Vietnamese and English translation JSONs
├── utils/            # High-precision calculation engine and formatters
└── types/            # Centralized TypeScript definitions
```

---

## 🧪 The Formula

The calculator computes the **Notional Position Size** (Value) rather than just unit count, making it applicable to any asset class (Stocks, Forex, Crypto):

```text
Risk Amount = Capital × Risk %
Stop Loss % = |Entry Price - Stop Loss Price| ÷ Entry Price
Position Size (Value) = Risk Amount ÷ Stop Loss %
```

**Example:**

- **Capital**: $10,000
- **Risk %**: 2% ($200 at risk)
- **Entry**: $100
- **Stop Loss**: $95 (5% drop)
- **Position Size**: $200 ÷ 0.05 = **$4,000**

---

## 🚦 Getting Started

### Installation

```sh
yarn install
```

### Development

```sh
yarn dev
```

### Testing & Coverage

We maintain rigorous testing for the calculation engine to ensure financial accuracy.

```sh
yarn test          # Run all tests
yarn coverage      # Generate coverage report
```

### Build for Production

```sh
yarn build
```

---

## 📄 License

MIT

> **Pro Tip:** Professional traders typically risk 1-2% of their capital per trade to ensure long-term survival in the markets.
