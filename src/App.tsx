import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { loadFromLocalStorage } from "./utils/utils";
import { initializeParameters } from "./store/slices/calculatorSlice";
import type { TradeParameters } from "./types";

import Home from "./pages/Home";
import AppLayout from "./components/layout/AppLayout";
import Footer from "./components/layout/Footer";
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));

const App = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const initialParams = { ...tradeParameters };
    let hasLoadedAny = false;

    (Object.keys(tradeParameters) as Array<keyof TradeParameters>).forEach(
      (key) => {
        const value = loadFromLocalStorage(key);
        if (value !== null) {
          initialParams[key] = parseFloat(value) as never;
          hasLoadedAny = true;
        }
      },
    );

    if (hasLoadedAny) {
      dispatch(initializeParameters(initialParams as TradeParameters));
    }
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
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      <Footer />
    </AppLayout>
  );
};

export default App;
