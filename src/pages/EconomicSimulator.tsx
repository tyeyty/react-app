import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── Types ──────────────────────────────────────────────
interface YearlyData {
  age: number;
  asset: number;
  consumption: number;
  income: number;
  pensionIncome: number;
}

type PensionType = "public" | "private";

interface Pension {
  enabled: boolean;
  type: PensionType;
  annualAmount: number;
  startAge: number;
  endAge: number;
}

type EventKind = "one-time" | "recurring";
type EventTarget = "asset" | "consumption" | "income";

interface LifeEvent {
  id: number;
  kind: EventKind;
  name: string;
  target: EventTarget;
  amount: number;
  age: number;
  endAge: number; // recurring 전용: 0 = 사망까지
}

type Inputs = typeof DEFAULT_INPUTS;

// ── Constants ──────────────────────────────────────────
const CATEGORIES = ["주거비", "식비", "교통비", "교육비", "레저/여가", "기타"];

const FIELD_LABELS: Record<keyof Inputs, string> = {
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

const DEFAULT_PENSION: Pension = {
  enabled: false,
  type: "public",
  annualAmount: 0,
  startAge: 65,
  endAge: 100,
};

// ── Helpers ────────────────────────────────────────────
const fmt = (n: number): string =>
  n >= 1e6
    ? (n / 1e6).toFixed(1) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(0) + "K"
    : Math.round(n).toLocaleString();

// ── Sub-components ─────────────────────────────────────
interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  highlighted: boolean;
}

const InputField = ({ label, name, value, onChange, highlighted }: InputFieldProps) => (
  <div className="mb-2.5">
    <label className="block text-xs text-slate-500 mb-1">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md px-2.5 py-1.5 text-xs outline-none transition-colors ${
        highlighted
          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
          : "bg-blue-100 border-blue-200 text-slate-800 focus:border-sky-400"
      }`}
    />
  </div>
);

interface PensionCardProps {
  index: number;
  pension: Pension;
  onChange: (index: number, updated: Pension) => void;
  colorClass: string;
  label: string;
  icon: string;
}

const PensionCard = ({ index, pension, onChange, colorClass, label, icon }: PensionCardProps) => {
  const update = <K extends keyof Pension>(field: K, value: Pension[K]) =>
    onChange(index, { ...pension, [field]: value });

  return (
    <div className={`rounded-xl border p-3 mb-3 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-bold text-slate-200">{label}</span>
        <label className="ml-auto flex items-center gap-1.5 cursor-pointer">
          <div
            onClick={() => update("enabled", !pension.enabled)}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              pension.enabled ? "bg-sky-500" : "bg-slate-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                pension.enabled ? "left-4" : "left-0.5"
              }`}
            />
          </div>
          <span className="text-xs text-slate-400">{pension.enabled ? "사용" : "미사용"}</span>
        </label>
      </div>

      {pension.enabled && (
        <div className="space-y-2">
          {/* 공적/민간 선택 */}
          <div className="flex gap-2 mb-2">
            {(["public", "private"] as PensionType[]).map((t) => (
              <button
                key={t}
                onClick={() => update("type", t)}
                className={`flex-1 py-1 rounded text-xs font-semibold transition-colors border ${
                  pension.type === t
                    ? "bg-sky-600 border-sky-400 text-white"
                    : "bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {t === "public" ? "🏛 공적연금" : "🏦 민간/개인연금"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">연간 수령액</label>
            <input
              type="number"
              value={pension.annualAmount}
              onChange={(e) => update("annualAmount", parseFloat(e.target.value) || 0)}
              className="w-full bg-blue-100 border border-blue-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">수령 시작 나이</label>
            <input
              type="number"
              value={pension.startAge}
              onChange={(e) => update("startAge", parseFloat(e.target.value) || 0)}
              className="w-full bg-blue-100 border border-blue-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          {pension.type === "private" && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">수령 종료 나이</label>
              <input
                type="number"
                value={pension.endAge}
                onChange={(e) => update("endAge", parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-100 border border-blue-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                수령 기간: {Math.max(0, pension.endAge - pension.startAge)}년
              </p>
            </div>
          )}

          {pension.type === "public" && (
            <p className="text-xs text-slate-500 italic">※ 공적연금은 사망 시까지 수령</p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Events Section Component ───────────────────────────
const TARGET_LABELS: Record<EventTarget, string> = {
  asset: "💰 자산 직접",
  consumption: "🛒 연간 소비",
  income: "💼 연간 수입",
};

interface EventsSectionProps {
  events: LifeEvent[];
  onChange: (events: LifeEvent[]) => void;
}

let nextId = 1;

const EventsSection = ({ events, onChange }: EventsSectionProps) => {
  const add = () => {
    onChange([
      ...events,
      {
        id: nextId++,
        kind: "one-time",
        name: "",
        target: "asset",
        amount: 0,
        age: 60,
        endAge: 0,
      },
    ]);
  };

  const remove = (id: number) => onChange(events.filter((e) => e.id !== id));

  const update = <K extends keyof LifeEvent>(id: number, field: K, value: LifeEvent[K]) =>
    onChange(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  return (
    <div className="space-y-2">
      {events.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-2">이벤트가 없습니다</p>
      )}
      {events.map((ev) => (
        <div key={ev.id} className="bg-slate-800 border border-amber-900 rounded-xl p-3">
          {/* 헤더: 이름 + 삭제 */}
          <div className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="이벤트 이름"
              value={ev.name}
              onChange={(e) => update(ev.id, "name", e.target.value)}
              className="flex-1 bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-sky-400"
            />
            <button
              onClick={() => remove(ev.id)}
              className="text-slate-500 hover:text-red-400 text-sm leading-none px-1"
            >
              ✕
            </button>
          </div>

          {/* 타입 선택 */}
          <div className="flex gap-1 mb-2">
            {(["one-time", "recurring"] as EventKind[]).map((k) => (
              <button
                key={k}
                onClick={() => update(ev.id, "kind", k)}
                className={`flex-1 py-0.5 rounded text-xs font-semibold border transition-colors ${
                  ev.kind === k
                    ? "bg-amber-700 border-amber-500 text-white"
                    : "bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {k === "one-time" ? "⚡ 일회성" : "🔁 반복"}
              </button>
            ))}
          </div>

          {/* 대상 선택 */}
          <div className="flex gap-1 mb-2">
            {(["asset", "consumption", "income"] as EventTarget[]).map((t) => (
              <button
                key={t}
                onClick={() => update(ev.id, "target", t)}
                className={`flex-1 py-0.5 rounded text-xs border transition-colors ${
                  ev.target === t
                    ? "bg-sky-700 border-sky-500 text-white font-semibold"
                    : "bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {TARGET_LABELS[t]}
              </button>
            ))}
          </div>

          {/* 금액 */}
          <div className="mb-2">
            <label className="block text-xs text-slate-400 mb-1">
              금액 (+ 증가 / − 감소)
            </label>
            <input
              type="number"
              value={ev.amount}
              onChange={(e) => update(ev.id, "amount", parseFloat(e.target.value) || 0)}
              className="w-full bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-sky-400"
            />
          </div>

          {/* 나이 */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">
                {ev.kind === "one-time" ? "발생 나이" : "시작 나이"}
              </label>
              <input
                type="number"
                value={ev.age}
                onChange={(e) => update(ev.id, "age", parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-sky-400"
              />
            </div>
            {ev.kind === "recurring" && (
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">종료 나이 (0=사망)</label>
                <input
                  type="number"
                  value={ev.endAge}
                  onChange={(e) => update(ev.id, "endAge", parseFloat(e.target.value) || 0)}
                  className="w-full bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-sky-400"
                />
              </div>
            )}
          </div>

          {/* 요약 */}
          <p className="text-xs text-amber-400 mt-2 italic">
            {ev.kind === "one-time"
              ? `${ev.age}세: ${TARGET_LABELS[ev.target]} ${ev.amount >= 0 ? "+" : ""}${ev.amount.toLocaleString()}`
              : `${ev.age}세~${ev.endAge > 0 ? ev.endAge + "세" : "사망"}: ${TARGET_LABELS[ev.target]} ${ev.amount >= 0 ? "+" : ""}${ev.amount.toLocaleString()}/년`}
          </p>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-1.5 rounded-lg text-xs font-bold border border-dashed border-amber-700 text-amber-500 hover:bg-amber-950 transition-colors"
      >
        + 이벤트 추가
      </button>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────
export default function EconomicFreedomSimulator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<YearlyData[]>([]);
  const [ran, setRan] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [pensionOpen, setPensionOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(
    Array(CATEGORIES.length).fill(0)
  );
  const [applied, setApplied] = useState(false);
  const [pensions, setPensions] = useState<Pension[]>([
    { ...DEFAULT_PENSION },
    { ...DEFAULT_PENSION, startAge: 55, endAge: 75, type: "private" },
  ]);

  const totalMonthly = monthlyExpenses.reduce((a, b) => a + b, 0);
  const totalAnnual = totalMonthly * 12;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handlePensionChange = (index: number, updated: Pension) => {
    setPensions((prev) => prev.map((p, i) => (i === index ? updated : p)));
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

    const activePensions = pensions.filter((p) => p.enabled && p.annualAmount > 0);
    const activeEvents = events;
    const appliedOneTime = new Set<number>();
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

      let pensionIncome = 0;
      for (const p of activePensions) {
        const isPublicActive = p.type === "public" && ageNow >= p.startAge;
        const isPrivateActive = p.type === "private" && ageNow >= p.startAge && ageNow < p.endAge;
        if (isPublicActive || isPrivateActive) {
          pensionIncome += p.annualAmount / 12;
        }
      }

      // 이벤트 적용
      for (const ev of activeEvents) {
        if (ev.kind === "one-time") {
          // 해당 월에 한 번만
          const evMonth = Math.round((ev.age - currentAge) * 12);
          if (m === evMonth && !appliedOneTime.has(ev.id)) {
            appliedOneTime.add(ev.id);
            if (ev.target === "asset") asset += ev.amount;
            else if (ev.target === "consumption") consumption += ev.amount;
            else if (ev.target === "income") income += ev.amount;
          }
        } else {
          // recurring: 매월 1/12씩
          const active = ageNow >= ev.age && (ev.endAge === 0 || ageNow < ev.endAge);
          if (active) {
            if (ev.target === "asset") asset += ev.amount / 12;
            else if (ev.target === "consumption") consumption += ev.amount / 12;
            else if (ev.target === "income") income += ev.amount / 12;
          }
        }
      }

      asset = asset * (1 + mReturn) + income / 12 + pensionIncome - consumption / 12;
      consumption *= 1 + mConsGrowth;
      if (income > 0) income *= 1 + mIncGrowth;
      if (Math.random() < mRecession) asset *= 1 - recessionDrop / 100;
      if (Math.random() < mDoomsday) {
        asset *= 1 - doomsdayDrop / 100;
        consumption *= 1 - doomsdayConsumptionReduction / 100;
      }

      monthly.push({ age: ageNow, asset, consumption, income, pensionIncome: pensionIncome * 12 });
    }

    const yearly: YearlyData[] = [];
    for (let y = 0; y < 100 - currentAge; y++) {
      const last = monthly[y * 12 + 11] ?? monthly[monthly.length - 1];
      yearly.push({
        age: Math.round(currentAge + y + 1),
        asset: Math.max(0, last.asset),
        consumption: Math.max(0, last.consumption),
        income: Math.max(0, last.income),
        pensionIncome: Math.max(0, last.pensionIncome),
      });
    }

    setResults(yearly);
    setRan(true);
  };

  const ruined = results.find((r) => r.asset <= 0);
  const hasPension = pensions.some((p) => p.enabled && p.annualAmount > 0);

  return (
    <div className="font-sans min-h-screen text-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-800 flex items-center gap-3">
        <span className="text-2xl">💰</span>
        <div>
          <h1 className="text-xl font-bold text-sky-400 tracking-tight m-0">경제적 자유 시뮬레이터</h1>
          <p className="text-xs text-slate-500 mt-0.5 mb-0">Monte Carlo 기반 자산·소비·수입·연금 장기 예측</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 px-4 py-5 overflow-y-auto shrink-0 border-r border-slate-800 space-y-1">

          {/* 소비 계산기 */}
          <button
            onClick={() => setCalcOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 transition-colors text-emerald-300 text-xs font-semibold"
          >
            <span>🧮 소비액 계산기</span>
            <span>{calcOpen ? "▲" : "▼"}</span>
          </button>

          {calcOpen && (
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-3">월별 카테고리 입력 → 연간 소비 자동 계산</p>
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 w-20 shrink-0">{cat}</span>
                  <input
                    type="number"
                    value={monthlyExpenses[idx]}
                    onChange={(e) => handleExpenseChange(idx, parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-blue-100 border border-blue-200 rounded px-2 py-1 text-slate-800 text-xs outline-none focus:border-sky-400"
                  />
                  <span className="text-xs text-slate-500">$/월</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>월 합계</span><span>{totalMonthly.toLocaleString()} $</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">연간 소비 추정</span>
                  <span className="text-emerald-300">{totalAnnual.toLocaleString()} $</span>
                </div>
              </div>
              <button
                onClick={handleApply}
                className={`mt-3 w-full py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  applied
                    ? "bg-emerald-800 border-emerald-600 text-emerald-300 cursor-default"
                    : "bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-400"
                }`}
              >
                {applied ? "✓ 반영됨" : "→ 연간 소비에 반영"}
              </button>
            </div>
          )}

          {/* 연금 섹션 */}
          <button
            onClick={() => setPensionOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-violet-900 hover:bg-violet-800 transition-colors text-violet-300 text-xs font-semibold"
          >
            <span>🏦 연금 설정</span>
            <span>{pensionOpen ? "▲" : "▼"}</span>
          </button>

          {pensionOpen && (
            <div>
              <PensionCard
                index={0}
                pension={pensions[0]}
                onChange={handlePensionChange}
                colorClass="bg-slate-800 border-violet-800"
                label="연금 #1"
                icon="🥇"
              />
              <PensionCard
                index={1}
                pension={pensions[1]}
                onChange={handlePensionChange}
                colorClass="bg-slate-800 border-indigo-800"
                label="연금 #2"
                icon="🥈"
              />
            </div>
          )}

          {/* 이벤트 섹션 */}
          <button
            onClick={() => setEventsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-950 hover:bg-amber-900 transition-colors text-amber-300 text-xs font-semibold"
          >
            <span>⚡ 생애 이벤트 {events.length > 0 && `(${events.length})`}</span>
            <span>{eventsOpen ? "▲" : "▼"}</span>
          </button>

          {eventsOpen && (
            <EventsSection events={events} onChange={setEvents} />
          )}

          {/* 파라미터 */}
          <div className="text-xs font-semibold text-slate-400 pt-2 pb-1 uppercase tracking-widest">
            파라미터 설정
          </div>
          {(Object.keys(DEFAULT_INPUTS) as (keyof Inputs)[]).map((key) => (
            <InputField
              key={key}
              label={FIELD_LABELS[key]}
              name={key}
              value={inputs[key]}
              onChange={(e) => {
                handleChange(e);
                if (key === "annualConsumption") setApplied(false);
              }}
              highlighted={key === "annualConsumption" && applied}
            />
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
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
              <span className="text-4xl">📊</span>
              <p className="text-sm">← 파라미터를 입력하고 시뮬레이션을 실행하세요</p>
              {hasPension && (
                <p className="text-xs text-violet-400">
                  연금 {pensions.filter((p) => p.enabled).length}개 설정됨
                </p>
              )}
            </div>
          ) : (
            <>
              {ruined && (
                <div className="bg-red-950 border border-red-600 rounded-lg px-4 py-2.5 mb-4 text-xs text-red-300">
                  ⚠️ <strong>{ruined.age}세</strong>에 자산이 소진됩니다. 계획을 재검토하세요.
                </div>
              )}

              {/* 연금 요약 배지 */}
              {hasPension && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {pensions.map((p, i) =>
                    p.enabled && p.annualAmount > 0 ? (
                      <div
                        key={i}
                        className="bg-violet-900 border border-violet-700 rounded-lg px-3 py-1.5 text-xs text-violet-200 flex items-center gap-2"
                      >
                        <span>{p.type === "public" ? "🏛" : "🏦"}</span>
                        <span className="font-semibold">연금 #{i + 1}</span>
                        <span className="text-violet-400">|</span>
                        <span>{fmt(p.annualAmount)}/년</span>
                        <span className="text-violet-400">|</span>
                        <span>
                          {p.startAge}세 ~ {p.type === "public" ? "사망" : `${p.endAge}세`}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Chart */}
              <div className="bg-slate-800 rounded-xl p-5 mb-5">
                <div className="text-sm font-semibold text-slate-400 mb-3">
                  자산 · 소비 · 수입 · 연금 추이
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="age"
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      label={{ value: "나이", position: "insideBottomRight", offset: -5, fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={fmt} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                      formatter={(val: unknown) => [fmt(Number(val)), String(val)]}
                      labelFormatter={(l: unknown) => `나이: ${l}세`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="asset" name="자산" stroke="#22c55e" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="consumption" name="연 소비" stroke="#ef4444" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="income" name="연 수입" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    {hasPension && (
                      <Line
                        type="monotone"
                        dataKey="pensionIncome"
                        name="연금 수령액"
                        stroke="#a78bfa"
                        dot={false}
                        strokeWidth={2}
                        strokeDasharray="5 3"
                      />
                    )}
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
                        {["나이", "자산", "연 소비", "연 수입", ...(hasPension ? ["연금"] : [])].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-right text-slate-500 font-semibold sticky top-0 bg-slate-950"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr
                          key={i}
                          className={`border-t border-slate-700 ${r.asset <= 0 ? "bg-red-950" : ""}`}
                        >
                          <td className="px-3 py-1.5 text-right text-slate-400">{r.age}세</td>
                          <td className={`px-3 py-1.5 text-right font-semibold ${r.asset <= 0 ? "text-red-400" : "text-green-400"}`}>
                            {fmt(r.asset)}
                          </td>
                          <td className="px-3 py-1.5 text-right text-red-400">{fmt(r.consumption)}</td>
                          <td className="px-3 py-1.5 text-right text-blue-400">{fmt(r.income)}</td>
                          {hasPension && (
                            <td className="px-3 py-1.5 text-right text-violet-400">
                              {r.pensionIncome > 0 ? fmt(r.pensionIncome) : <span className="text-slate-600">-</span>}
                            </td>
                          )}
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