# Position Size Calculator

A React/TypeScript application for traders to calculate optimal position sizes based on risk management principles. Now powered by Redux for state management.

## Overview

This application helps traders determine the appropriate position size for trades based on their total capital, risk tolerance, and price levels (entry, stop-loss, take-profit). It uses the following formula:

```
Position Size = (Total Capital × Risk Percentage) ÷ |Entry Price - Stop Loss Price|
```

Redux is used to manage global state, enabling features like persistent user settings, input history, and reusable calculations across components.

## Features

- 🔢 Input fields for trading parameters (entry, stop-loss, take-profit prices)
- ⚙️ Customizable risk percentage and capital settings (stored via Redux)
- 📈 Position size calculation with real-time updates
- 📊 Visual risk/reward ratio display using dynamic progress bars or charts
- 🕹️ Interactive sliders for adjusting risk percentage or leverage (optional)
- 💾 Input history or saved configurations for different assets (powered by Redux)
- 📱 Responsive design for desktop and mobile use

## Recommended Additional Features

To increase usability and learning value for traders:

- 🧠 Basic trade outcome simulation (e.g., profit/loss if TP/SL is hit)
- ☁️ Local storage persistence (sync Redux store with local storage)
- 🗃️ Add multiple calculators for managing several trades
- 🌐 Currency selector or FX converter integration
- 📤 Export to CSV/JSON (for journaling trades)

## Technical Stack

- React 19 (Functional Components + Hooks)
- Redux Toolkit + React-Redux
- TypeScript
- TailwindCSS 4
- Vite

## Project Structure

```
src/
├── components/           # UI components
│   ├── layout/           # Layout components (Header, Footer)
│   └── calculator/       # Calculator-specific components
├── hooks/                # Custom React hooks
├── pages/                # Page components (e.g., Home, Settings)
├── redux/                # Redux slices and store setup
│   ├── calculatorSlice.ts
│   └── store.ts
├── types/                # TypeScript type definitions
└── utils/                # Utility functions for calculations
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## License

MIT
