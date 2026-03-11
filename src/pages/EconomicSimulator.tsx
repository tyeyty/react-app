import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface YearlyData {
  age: number;
  asset: number;
  consumption: number;
  income: number;
}

const CATEGORIES = ["주거비", "식비", "교통비", "교육비", "레저/여가", "기타"];

const FIELD_LABELS: Record<string, string> = {
  currentAge: "현재 나이",
  currentAsset: "현재 자산",
  assetReturn: "연 수익률 (%)",
  annualConsumption: "연간 소비",
  consumptionGrowth: "소비 증가율 (%)",
  annualIncome: "연간 수입",
  incomeGrowth: "수입 증가율 (%)",
  retirementAge: "은퇴 나이",
  retirementConsumptionChange: "은퇴 후 소비 변화액 (감소면 음수)",
  childIndependenceAge: "자녀 독립 나이",
  childConsumptionReduction: "자녀 독립 후 소비 감소액",
  recessionProbability: "불황 확률 (연간, 0~1)",
  recessionDrop: "불황 시 자산 감소율 (%)",
  doomsdayProbability: "둠스데이 확률 (연간, 0~1)",
  doomsdayDrop: "둠스데이 자산 감소율 (%)",
  doomsdayConsumptionReduction: "둠스데이 소비 감소율 (%)",
};

const DEFAULT_INPUTS = {
  currentAge: 30,
  currentAsset: 50000,
  assetReturn: 5,
  annualConsumption: 20000,
  consumptionGrowth: 2,
  annualIncome: 50000,
  incomeGrowth: 3,
  retirementAge: 65,
  retirementConsumptionChange: -5000,
  childIndependenceAge: 52,
  childConsumptionReduction: 3000,
  recessionProbability: 0.1,
  recessionDrop: 20,
  doomsdayProbability: 0.02,
  doomsdayDrop: 50,
  doomsdayConsumptionReduction: 30,
};

const fmt = (n: number) =>
  n >= 1e6
    ? (n / 1e6).toFixed(1) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(0) + "K"
    : Math.round(n).toLocaleString();

export default function EconomicFreedomSimulator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [results, setResults] = useState<YearlyData[]>([]);
  const [ran, setRan] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(Array(CATEGORIES.length).fill(0));
  const [applied, setApplied] = useState(false);

  const totalMonthly = monthlyExpenses.reduce((a, b) => a + b, 0);
  const totalAnnual = totalMonthly * 12;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleExpenseChange = (index: number, value: number) => {
    const updated = [...monthlyExpenses];
    updated[index] = value;
    setMonthlyExpenses(updated);
    setApplied(false);
  };

  const handleApply = () => {
    setInputs((prev) => ({ ...prev, annualConsumption: totalAnnual }));
    setApplied(true);
  };

  const runSimulation = () => {
    const {
      currentAge, currentAsset, assetReturn,
      annualConsumption, consumptionGrowth,
      annualIncome, incomeGrowth,
      retirementAge, retirementConsumptionChange,
      childIndependenceAge, childConsumptionReduction,
      recessionProbability, recessionDrop,
      doomsdayProbability, doomsdayDrop,
      doomsdayConsumptionReduction,
    } = inputs;

    const mReturn = Math.pow(1 + assetReturn / 100, 1 / 12) - 1;
    const mConsGrowth = Math.pow(1 + consumptionGrowth / 100, 1 / 12) - 1;
    const mIncGrowth = Math.pow(1 + incomeGrowth / 100, 1 / 12) - 1;
    const mRecession = 1 - Math.pow(1 - recessionProbability, 1 / 12);
    const mDoomsday = 1 - Math.pow(1 - doomsdayProbability, 1 / 12);

    let asset = currentAsset;
    let consumption = annualConsumption;
    let income = annualIncome;
    let childReduced = false;
    let retirementAdjusted = false;

    const monthly: YearlyData[] = [];

    for (let m = 0; m < (100 - currentAge) * 12; m++) {
      const ageNow = currentAge + m / 12;
      if (ageNow >= retirementAge) income = 0;
      if (!retirementAdjusted && ageNow >= retirementAge) {
        consumption = Math.max(0, consumption + retirementConsumptionChange);
        retirementAdjusted = true;
      }
      if (!childReduced && ageNow >= childIndependenceAge) {
        consumption = Math.max(0, consumption - childConsumptionReduction);
        childReduced = true;
      }
      asset = asset * (1 + mReturn) + income / 12 - consumption / 12;
      consumption *= 1 + mConsGrowth;
      if (income > 0) income *= 1 + mIncGrowth;
      if (Math.random() < mRecession) asset *= 1 - recessionDrop / 100;
      if (Math.random() < mDoomsday) {
        asset *= 1 - doomsdayDrop / 100;
        consumption *= 1 - doomsdayConsumptionReduction / 100;
      }
      monthly.push({ age: ageNow, asset, consumption, income });
    }

    const yearly: YearlyData[] = [];
    for (let y = 0; y < 100 - currentAge; y++) {
      const last = monthly[y * 12 + 11] ?? monthly[monthly.length - 1];
      yearly.push({
        age: Math.round(currentAge + y + 1),
        asset: Math.max(0, last.asset),
        consumption: Math.max(0, last.consumption),
        income: Math.max(0, last.income),
      });
    }

    setResults(yearly);
    setRan(true);
  };

  const ruined = results.find((r) => r.asset <= 0);

  return (
    <div className="font-sans min-h-screen text-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-sky-400 tracking-tight m-0">
          💰 경제적 자유 시뮬레이터
        </h1>
        <p className="text-xs text-slate-500 mt-1 mb-0">
          Monte Carlo 기반 자산·소비·수입 장기 예측
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 px-4 py-5 overflow-y-auto shrink-0 border-r border-slate-800">

          {/* 소비 계산기 토글 */}
          <button
            onClick={() => setCalcOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 transition-colors text-emerald-300 text-xs font-semibold"
          >
            <span>🧮 소비액 계산기</span>
            <span className="text-lg leading-none">{calcOpen ? "▲" : "▼"}</span>
          </button>

          {/* 소비 계산기 패널 */}
          {calcOpen && (
            <div className="mb-4 bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-3">월별 카테고리 입력 → 연간 소비 자동 계산</p>
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 w-20 shrink-0">{cat}</span>
                  <input
                    type="number"
                    value={monthlyExpenses[idx]}
                    onChange={(e) => handleExpenseChange(idx, parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-blue-100 border border-blue-200 rounded px-2 py-1 text-slate-800 text-xs outline-none focus:border-sky-400 transition-colors"
                  />
                  <span className="text-xs text-slate-500 shrink-0">$/월</span>
                </div>
              ))}

              {/* 합계 */}
              <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>월 합계</span>
                  <span className="text-slate-200">{totalMonthly.toLocaleString()} $</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">연간 소비 추정</span>
                  <span className="text-emerald-300">{totalAnnual.toLocaleString()} $</span>
                </div>
              </div>

              {/* 반영 버튼 */}
              <button
                onClick={handleApply}
                className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  applied
                    ? "bg-emerald-800 border-emerald-600 text-emerald-300 cursor-default"
                    : "bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-400 cursor-pointer"
                }`}
              >
                {applied ? "✓ 시뮬레이터에 반영됨" : "→ 연간 소비에 반영"}
              </button>
            </div>
          )}

          {/* 파라미터 설정 */}
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-widest">
            파라미터 설정
          </div>
          {Object.keys(DEFAULT_INPUTS).map((key) => (
            <div key={key} className="mb-2.5">
              <label className="block text-xs text-slate-500 mb-1">
                {FIELD_LABELS[key]}
              </label>
              <input
                type="number"
                name={key}
                value={inputs[key as keyof typeof inputs]}
                onChange={(e) => {
                  handleChange(e);
                  if (key === "annualConsumption") setApplied(false);
                }}
                className={`w-full border rounded-md px-2.5 py-1.5 text-xs outline-none transition-colors ${
                  key === "annualConsumption" && applied
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                    : "bg-blue-100 border-blue-200 text-slate-800 focus:border-sky-400"
                }`}
              />
            </div>
          ))}

          <button
            onClick={runSimulation}
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 border-none rounded-lg text-white font-bold text-sm cursor-pointer tracking-wide hover:opacity-90 transition-opacity"
          >
            ▶ 시뮬레이션 실행
          </button>
        </div>

        {/* Main */}
        <div className="flex-1 px-7 py-6 overflow-y-auto">
          {!ran ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              ← 파라미터를 입력하고 시뮬레이션을 실행하세요
            </div>
          ) : (
            <>
              {ruined && (
                <div className="bg-red-950 border border-red-600 rounded-lg px-4 py-2.5 mb-4 text-xs text-red-300">
                  ⚠️ <strong>{ruined.age}세</strong>에 자산이 소진됩니다. 계획을 재검토하세요.
                </div>
              )}

              {/* Chart */}
              <div className="bg-slate-800 rounded-xl p-5 mb-5">
                <div className="text-sm font-semibold text-slate-400 mb-3">자산 · 소비 · 수입 추이</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="age" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: "나이", position: "insideBottomRight", offset: -5, fill: "#64748b", fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={fmt} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => [fmt(Number(val)), String(val)]}
                      labelFormatter={(l) => `나이: ${l}세`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="asset" name="자산" stroke="#22c55e" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="consumption" name="연 소비" stroke="#ef4444" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="income" name="연 수입" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="bg-slate-800 rounded-xl px-5 py-4">
                <div className="text-sm font-semibold text-slate-400 mb-3">연도별 상세</div>
                <div className="overflow-y-auto max-h-72">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950">
                        {["나이", "자산", "연 소비", "연 수입"].map((h) => (
                          <th key={h} className="px-3 py-2 text-right text-slate-500 font-semibold sticky top-0 bg-slate-950">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr
                          key={i}
                          className={`border-t border-slate-700 ${r.asset <= 0 ? "bg-red-950" : "bg-transparent"}`}
                        >
                          <td className="px-3 py-1.5 text-right text-slate-400">{r.age}세</td>
                          <td className={`px-3 py-1.5 text-right font-semibold ${r.asset <= 0 ? "text-red-400" : "text-green-400"}`}>{fmt(r.asset)}</td>
                          <td className="px-3 py-1.5 text-right text-red-400">{fmt(r.consumption)}</td>
                          <td className="px-3 py-1.5 text-right text-blue-400">{fmt(r.income)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}