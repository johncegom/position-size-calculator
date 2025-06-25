import Home from "./pages/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { loadFromLocalStorage } from "./utils";
import { updateTradeParameter } from "./store/slices/calculatorSlice";
import type { TradeParameters } from "./types";
import { useEffect } from "react";

const App = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const keys: string[] = Object.keys(tradeParameters);
    keys.forEach((key) => {
      const value = loadFromLocalStorage(key);
      const numericValue = value === null ? 0 : parseFloat(value);
      dispatch(
        updateTradeParameter({
          name: key as keyof TradeParameters,
          value: numericValue,
        })
      );
    });
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;
