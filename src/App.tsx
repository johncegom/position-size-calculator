import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { loadFromLocalStorage } from "./utils/utils";
import { updateTradeParameter } from "./store/slices/calculatorSlice";
import type { TradeParameters } from "./types";

import Home from "./pages/Home";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AppLayout from "./components/layout/AppLayout";
import Footer from "./components/layout/Footer";
import "./App.css";

const App = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
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
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </AppLayout>
  );
};

export default App;
