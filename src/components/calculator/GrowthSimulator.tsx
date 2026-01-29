import { useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useTranslation } from "react-i18next";
import { formatToTwoDecimals } from "../../utils/formatters";

const GrowthSimulator = () => {
  const { t } = useTranslation();
  const { tradeParameters, calculationResult } = useSelector(
    (state: RootState) => state.calculator,
  );

  const [targetWinRate, setTargetWinRate] = useState(50);
  const [seed, setSeed] = useState(Date.now());
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { totalCapital, riskPercentage } = tradeParameters;
  const riskRewardRatio = calculationResult?.riskRewardRatio || 0;

  // Calculate required win rate to break even
  const requiredWinRate = riskRewardRatio > 0 ? 100 / (1 + riskRewardRatio) : 0;
  const isSafeWinRate = targetWinRate >= requiredWinRate;

  const simulationData = useMemo(() => {
    // Return safe defaults if we can't calculate yet
    if (!totalCapital || !riskPercentage || !riskRewardRatio) {
      return { safePath: [], riskPath: [] };
    }

    const tradeCount = 20;

    // Generate a fixed sequence of wins/losses based on win rate to keep chart stable
    const generateOutcomes = (rate: number, count: number) => {
      const wins = Math.round((rate / 100) * count);
      const losses = count - wins;
      const sequence = [];

      const step = count / wins;
      let nextWin = 0;

      for (let i = 0; i < count; i++) {
        if (
          wins > 0 &&
          i >= nextWin &&
          sequence.filter((x) => x).length < wins
        ) {
          sequence.push(true); // Win
          nextWin += step;
        } else {
          if (sequence.length - sequence.filter((x) => x).length < losses) {
            sequence.push(false); // Loss
          } else {
            sequence.push(true);
          }
        }
      }
      return sequence;
    };

    const outcomes = generateOutcomes(targetWinRate, tradeCount);

    // Shuffle deterministically based on seed
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    // Create an array of indices [0, 1, 2...] and shuffle them
    const indices = outcomes.map((_, i) => i);
    let m = indices.length;
    let currentSeed = seed;
    while (m) {
      const i = Math.floor(seededRandom(currentSeed++) * m--);
      const temp = indices[m];
      indices[m] = indices[i];
      indices[i] = temp;
    }

    const shuffledOutcomes = indices.map((i) => outcomes[i]);

    let currentBalanceSafe = totalCapital;
    let currentBalanceRisk = totalCapital;

    const safePath = [totalCapital];
    const riskPath = [totalCapital];

    // High risk factor (Aggressive)
    const riskMultiplier = 5;

    shuffledOutcomes.forEach((isWin) => {
      // Safe Strategy
      const riskAmountSafe = currentBalanceSafe * (riskPercentage / 100);
      if (isWin) {
        currentBalanceSafe += riskAmountSafe * riskRewardRatio;
      } else {
        currentBalanceSafe -= riskAmountSafe;
      }
      safePath.push(Math.max(0, currentBalanceSafe));

      // Risky Strategy
      const riskAmountRisk =
        currentBalanceRisk * ((riskPercentage * riskMultiplier) / 100);
      if (isWin) {
        currentBalanceRisk += riskAmountRisk * riskRewardRatio;
      } else {
        currentBalanceRisk -= riskAmountRisk;
      }
      riskPath.push(Math.max(0, currentBalanceRisk));
    });

    return { safePath, riskPath };
  }, [totalCapital, riskPercentage, riskRewardRatio, targetWinRate, seed]);

  // Only show if we have valid parameters
  if (!totalCapital || !riskPercentage || calculationResult === null) {
    return null;
  }

  // Interaction handlers
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = x / rect.width; // 0 to 1

    // Reverse map from the visual range (5% to 95%) back to index (0 to 20)
    // x_percent = 5 + (index / 20) * 90
    // (x_percent - 5) / 90 * 20 = index
    const rawIndex = ((percentage * 100 - 5) / 90) * 20;
    const index = Math.max(0, Math.min(20, Math.round(rawIndex)));

    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Chart Dimensions
  const height = 240;
  const padding = 20;

  // Scales
  const allValues = [...simulationData.safePath, ...simulationData.riskPath];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues, totalCapital * 1.05); // Ensure some headroom
  const range = maxVal - minVal || 1;

  const getY = (val: number) => {
    // Invert Y because SVG 0 is top
    return height - padding - ((val - minVal) / range) * (height - padding * 2);
  };

  const getX = (index: number) => {
    // Add padding (5% on each side) so the first and last points aren't on the edge
    return 5 + (index / 20) * 90;
  };

  const createPath = (data: number[]) => {
    if (data.length === 0) return "";
    return data
      .map((val, i) => {
        const x = getX(i);
        const y = getY(val);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const createAreaPath = (data: number[]) => {
    if (data.length === 0) return "";
    const linePath = createPath(data);
    return `${linePath} L 100 ${height} L 0 ${height} Z`;
  };

  const isBusted =
    simulationData.riskPath[simulationData.riskPath.length - 1] === 0;

  return (
    <div className="p-8 glass-panel rounded-2xl relative overflow-visible shadow-lg border border-white/20 dark:border-white/5 bg-gradient-to-b from-white/80 to-indigo-50/30 dark:from-gray-900/80 dark:to-indigo-900/10 backdrop-blur-xl">
      {/* Inline Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="safeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col gap-4 mb-6 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
              {t("growthSimulator.title", "Account Growth Projection")}
            </h2>
            <button
              onClick={() => setSeed(Date.now())}
              className="p-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-500 transition-colors"
              title={t("growthSimulator.reshuffle", "Reshuffle Simulation")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </button>
          </div>

          {/* Win Rate Control - Moved to top right for better compact layout */}
          <div className="bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-indigo-100/50 dark:border-white/10 w-full sm:w-auto min-w-[200px]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                {t("growthSimulator.winRate", "Win Rate")}
              </span>
              <span
                className={`text-xs font-bold ${isSafeWinRate ? "text-teal-600 dark:text-teal-400" : "text-red-500"}`}
              >
                {targetWinRate}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={targetWinRate}
              onChange={(e) => setTargetWinRate(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600 transition-all block mb-1.5"
            />
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-gray-400 uppercase font-semibold">
                {t("growthSimulator.requiredLabel")}
              </span>
              <span className="text-[9px] font-mono font-bold text-gray-600 dark:text-gray-300">
                &gt;{formatToTwoDecimals(requiredWinRate)}%
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-none">
          {t(
            "growthSimulator.subtitle",
            "Visualize the long-term impact of your risk settings. This simulation compares your current strategy against a high-risk approach.",
          )}
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        className="relative h-60 w-full rounded-xl border border-indigo-50 dark:border-white/5 bg-white/40 dark:bg-black/20 overflow-hidden cursor-crosshair touch-none"
      >
        {/* Chart */}
        <div className="absolute inset-0 top-0 bottom-0 left-[-2px] right-[-2px]">
          <svg
            viewBox="0 0 100 240"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
              <line
                key={tick}
                x1="0"
                y1={height - padding - tick * (height - padding * 2)}
                x2="100"
                y2={height - padding - tick * (height - padding * 2)}
                stroke="currentColor"
                strokeOpacity="0.05"
                strokeDasharray="4"
                className="text-gray-900 dark:text-white"
              />
            ))}

            {/* Aggressive Path (Area) */}
            <path
              d={createAreaPath(simulationData.riskPath)}
              fill="url(#riskGradient)"
              className="transition-all duration-300"
            />
            {/* Aggressive Path (Line) */}
            <path
              d={createPath(simulationData.riskPath)}
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-sm transition-all duration-300"
            />

            {/* Safe Path (Area) */}
            <path
              d={createAreaPath(simulationData.safePath)}
              fill="url(#safeGradient)"
              className="transition-all duration-300"
            />
            {/* Safe Path (Line) */}
            <path
              d={createPath(simulationData.safePath)}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-md transition-all duration-300"
            />
          </svg>
        </div>

        {/* Interactive Hover Line & Tooltip */}
        {hoverIndex !== null && (
          <>
            {/* Vertical Cursor Line */}
            {/* Vertical Cursor Line */}
            <div
              className="absolute top-0 bottom-0 w-px border-l border-dashed border-indigo-400/50 pointer-events-none z-20"
              style={{ left: `${5 + (hoverIndex / 20) * 90}%` }}
            />

            {/* Floating Tooltip - Smart Anchoring */}
            <div
              className={`absolute top-2 z-30 pointer-events-none transition-transform duration-150 ease-out min-w-[140px] ${
                hoverIndex < 7
                  ? "translate-x-[-10%]" // Left side: Anchor leftish
                  : hoverIndex > 13
                    ? "-translate-x-[90%]" // Right side: Anchor rightish
                    : "-translate-x-1/2" // Middle: Center
              }`}
              style={{ left: `${5 + (hoverIndex / 20) * 90}%` }}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                <p className="font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">
                  {t("growthSimulator.trade", "Trade")} #{hoverIndex}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-teal-600 font-bold dark:text-teal-400">
                    {t("growthSimulator.safe", "Safe")}
                  </span>
                  <span className="font-mono text-right text-gray-700 dark:text-gray-300">
                    ${formatToTwoDecimals(simulationData.safePath[hoverIndex])}
                  </span>

                  <span className="text-orange-500 font-bold">
                    {t("growthSimulator.aggressiveShort", "Aggr.")}
                  </span>
                  <span className="font-mono text-right text-gray-700 dark:text-gray-300">
                    ${formatToTwoDecimals(simulationData.riskPath[hoverIndex])}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500"></div>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {t("growthSimulator.currentStrategy", "Current Strategy")} (
            {riskPercentage}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {isBusted
              ? t("growthSimulator.busted", "Aggressive (Busted)")
              : `${t("growthSimulator.aggressiveStrategy", "Aggressive")} (${formatToTwoDecimals(riskPercentage * 5)}%)`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GrowthSimulator;
