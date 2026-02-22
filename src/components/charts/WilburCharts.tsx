/**
 * Reusable Wilbur chart components.
 * Uses Recharts with Wilbur's color palette and minimal visual style.
 */
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { ChartBlock } from "@/content/lessonTypes";

/* ── Color palette ──────────────────────────────────────── */

const WILBUR_COLORS = ["#0E5C4C", "#4A9B8A", "#8FD4C6", "#C4EAE5", "#FFD6B0", "#E3E2D2"];

function fmt(value: number, prefix = ""): string {
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
  return `${prefix}${value.toLocaleString()}`;
}

/* ── Shared tooltip ─────────────────────────────────────── */

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name?: string; color?: string }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}

function WilburTooltip({ active, payload, label, prefix = "", suffix = "" }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #e2dcd2",
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 13,
      fontFamily: "var(--font-sans)",
      boxShadow: "0 4px 14px rgba(26,20,10,0.09)",
    }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 4, color: "#1A1A1A" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color ?? "#0E5C4C", display: "flex", gap: 6 }}>
          <span>{p.name ?? ""}</span>
          <span style={{ fontWeight: 600 }}>{prefix}{p.value?.toLocaleString()}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Shared chart wrapper ───────────────────────────────── */

interface ChartWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

function ChartWrapper({ title, subtitle, children }: ChartWrapperProps) {
  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #eae5db",
      borderRadius: 12,
      padding: "20px 20px 12px",
      margin: "4px 0",
    }}>
      {title && (
        <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 600, color: "#1A1A1A", fontFamily: "var(--font-sans)" }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div style={{ marginBottom: 14, fontSize: 12, color: "#7a7a6e", fontFamily: "var(--font-sans)" }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Bar Chart ──────────────────────────────────────────── */

export function WilburBarChart({ title, subtitle, data, yAxisLabel }: ChartBlock) {
  const isCurrency = data.some(d => d.value > 500) && !yAxisLabel?.includes("%");
  const hasNegative = data.some(d => d.value < 0);

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fontFamily: "var(--font-sans)", fill: "#7a7a6e" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => isCurrency ? fmt(v, "$") : `${v}`}
            tick={{ fontSize: 11, fontFamily: "var(--font-sans)", fill: "#7a7a6e" }}
            axisLine={false}
            tickLine={false}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#7a7a6e" } } : undefined}
          />
          <Tooltip content={<WilburTooltip prefix={isCurrency ? "$" : ""} suffix={hasNegative ? "%" : ""} />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color ?? WILBUR_COLORS[i % WILBUR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Pie Chart ──────────────────────────────────────────── */

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function WilburPieChart({ title, subtitle, data }: ChartBlock) {
  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            cx={105}
            cy={105}
            labelLine={false}
            label={renderCustomLabel as (props: unknown) => JSX.Element}
            outerRadius={100}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? WILBUR_COLORS[i % WILBUR_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "var(--font-sans)", color: "#3d3d35" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: entry.color ?? WILBUR_COLORS[i % WILBUR_COLORS.length], flexShrink: 0 }} />
              {entry.label}
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
}

/* ── Compound Growth Line Chart ─────────────────────────── */

interface CompoundGrowthChartProps {
  title?: string;
  subtitle?: string;
  /** Principal, monthly contribution, years, rate */
  principal?: number;
  monthly?: number;
  years?: number;
  rate?: number;
}

function buildCompoundData(principal: number, monthly: number, years: number, rate: number) {
  const monthlyRate = rate / 100 / 12;
  const points: { year: string; balance: number; contributions: number }[] = [];
  let balance = principal;

  for (let y = 0; y <= years; y++) {
    const contributions = principal + monthly * 12 * y;
    points.push({ year: `Year ${y}`, balance: Math.round(balance), contributions: Math.round(contributions) });
    // Compound each year
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
  }
  return points;
}

export function CompoundGrowthChart({ title, subtitle, principal = 1000, monthly = 200, years = 20, rate = 7 }: CompoundGrowthChartProps) {
  const data = useMemo(
    () => buildCompoundData(principal, monthly, years, rate),
    [principal, monthly, years, rate],
  );

  return (
    <ChartWrapper title={title ?? "Compound Growth Projection"} subtitle={subtitle ?? "Hypothetical example — not a guarantee of future returns"}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 10, fontFamily: "var(--font-sans)", fill: "#7a7a6e" }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(years / 5)}
          />
          <YAxis
            tickFormatter={(v) => fmt(v, "$")}
            tick={{ fontSize: 10, fontFamily: "var(--font-sans)", fill: "#7a7a6e" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => [
              `$${Number(value).toLocaleString()}`,
              name === "balance" ? "Total value" : "Amount contributed",
            ]}
          />
          <Legend
            formatter={(value) => value === "balance" ? "Total value" : "Contributions only"}
            wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
          />
          <Line type="monotone" dataKey="balance" stroke="#0E5C4C" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="contributions" stroke="#8FD4C6" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Compound Interest Calculator (interactive) ─────────── */

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency": return `$${value.toLocaleString()}`;
    case "percent": return `${value}%`;
    case "years": return `${value} years`;
    default: return `${value}`;
  }
}

interface CompoundCalcProps {
  initialState?: { principal: number; monthly: number; years: number; rate: number };
}

export function CompoundInterestCalculator({ initialState }: CompoundCalcProps) {
  const [principal, setPrincipal] = useState(initialState?.principal ?? 1000);
  const [monthly, setMonthly] = useState(initialState?.monthly ?? 200);
  const [years, setYears] = useState(initialState?.years ?? 20);
  const [rate, setRate] = useState(initialState?.rate ?? 7);

  const monthlyRate = rate / 100 / 12;
  const finalBalance = useMemo(() => {
    let b = principal;
    for (let m = 0; m < years * 12; m++) {
      b = b * (1 + monthlyRate) + monthly;
    }
    return Math.round(b);
  }, [principal, monthly, years, rate, monthlyRate]);

  const totalContributions = Math.round(principal + monthly * 12 * years);
  const totalGrowth = finalBalance - totalContributions;

  const sliders = [
    { id: "principal", label: "Starting amount", value: principal, set: setPrincipal, min: 0, max: 50000, step: 500, format: "currency" },
    { id: "monthly", label: "Monthly contribution", value: monthly, set: setMonthly, min: 0, max: 2000, step: 25, format: "currency" },
    { id: "years", label: "Years invested", value: years, set: setYears, min: 1, max: 40, step: 1, format: "years" },
    { id: "rate", label: "Annual return rate", value: rate, set: setRate, min: 1, max: 12, step: 0.5, format: "percent" },
  ];

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #eae5db", borderRadius: 12, padding: "20px", margin: "4px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, fontFamily: "var(--font-sans)", color: "#1A1A1A" }}>
        Compound Interest Calculator
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 20 }}>
        {sliders.map(({ id, label, value, set, min, max, step, format }) => (
          <div key={id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#7a7a6e", fontFamily: "var(--font-sans)" }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0E5C4C", fontFamily: "var(--font-sans)" }}>{formatValue(value, format)}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0E5C4C", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Final value", value: `$${finalBalance.toLocaleString()}`, highlight: true },
          { label: "Contributions", value: `$${totalContributions.toLocaleString()}`, highlight: false },
          { label: "Growth", value: `$${totalGrowth.toLocaleString()}`, highlight: false },
        ].map(({ label, value, highlight }) => (
          <div key={label} style={{
            textAlign: "center", padding: "12px 8px",
            backgroundColor: highlight ? "#0E5C4C" : "#f8f6f0",
            borderRadius: 8, border: highlight ? "none" : "1px solid #eae5db",
          }}>
            <div style={{ fontSize: 12, color: highlight ? "rgba(255,255,255,0.75)" : "#7a7a6e", fontFamily: "var(--font-sans)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: highlight ? "#fff" : "#1A1A1A", fontFamily: "var(--font-sans)" }}>{value}</div>
          </div>
        ))}
      </div>

      <CompoundGrowthChart principal={principal} monthly={monthly} years={years} rate={rate} />

      <div style={{ fontSize: 11, color: "#b0ab9e", textAlign: "center", marginTop: 8, fontFamily: "var(--font-sans)" }}>
        Hypothetical example only. Past performance does not guarantee future results. This is not financial advice.
      </div>
    </div>
  );
}

/* ── Debt Payoff Calculator ─────────────────────────────── */

export function DebtPayoffCalculator() {
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(20);
  const [monthly, setMonthly] = useState(300);

  const { months, totalPaid, totalInterest } = useMemo(() => {
    const monthlyRate = apr / 100 / 12;
    let bal = balance;
    let m = 0;
    let paid = 0;

    while (bal > 0 && m < 600) {
      const interest = bal * monthlyRate;
      const payment = Math.min(monthly, bal + interest);
      paid += payment;
      bal = bal + interest - payment;
      m++;
    }

    return {
      months: m,
      totalPaid: Math.round(paid),
      totalInterest: Math.round(paid - balance),
    };
  }, [balance, apr, monthly]);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const timeStr = years > 0 ? `${years}y ${remainingMonths}mo` : `${months} months`;

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #eae5db", borderRadius: 12, padding: "20px", margin: "4px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, fontFamily: "var(--font-sans)", color: "#1A1A1A" }}>
        Debt Payoff Calculator
      </div>

      {[
        { id: "balance", label: "Total debt balance", value: balance, set: setBalance, min: 500, max: 50000, step: 500, format: "currency" },
        { id: "apr", label: "Interest rate (APR)", value: apr, set: setApr, min: 1, max: 36, step: 1, format: "percent" },
        { id: "monthly", label: "Monthly payment", value: monthly, set: setMonthly, min: 25, max: 3000, step: 25, format: "currency" },
      ].map(({ id, label, value, set, min, max, step, format }) => (
        <div key={id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#7a7a6e", fontFamily: "var(--font-sans)" }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0E5C4C", fontFamily: "var(--font-sans)" }}>{formatValue(value, format)}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => set(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#0E5C4C" }}
          />
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
        {[
          { label: "Payoff time", value: timeStr, highlight: true },
          { label: "Total paid", value: `$${totalPaid.toLocaleString()}`, highlight: false },
          { label: "Total interest", value: `$${totalInterest.toLocaleString()}`, highlight: false, warn: totalInterest > balance * 0.4 },
        ].map(({ label, value, highlight, warn }) => (
          <div key={label} style={{
            textAlign: "center", padding: "12px 8px",
            backgroundColor: highlight ? "#0E5C4C" : warn ? "rgba(217,83,79,0.07)" : "#f8f6f0",
            borderRadius: 8,
            border: highlight ? "none" : warn ? "1px solid rgba(217,83,79,0.2)" : "1px solid #eae5db",
          }}>
            <div style={{ fontSize: 12, color: highlight ? "rgba(255,255,255,0.75)" : "#7a7a6e", fontFamily: "var(--font-sans)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: highlight ? "#fff" : warn ? "#d9534f" : "#1A1A1A", fontFamily: "var(--font-sans)" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Budget Calculator ──────────────────────────────────── */

export function BudgetCalculator() {
  const [income, setIncome] = useState(4000);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);

  const savingsPct = Math.max(0, 100 - needsPct - wantsPct);
  const needs = Math.round(income * needsPct / 100);
  const wants = Math.round(income * wantsPct / 100);
  const savings = Math.round(income * savingsPct / 100);


  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #eae5db", borderRadius: 12, padding: "20px", margin: "4px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, fontFamily: "var(--font-sans)", color: "#1A1A1A" }}>
        Budget Calculator
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#7a7a6e", fontFamily: "var(--font-sans)" }}>Monthly take-home pay</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0E5C4C", fontFamily: "var(--font-sans)" }}>${income.toLocaleString()}</span>
        </div>
        <input type="range" min={1000} max={15000} step={100} value={income} onChange={(e) => setIncome(Number(e.target.value))} style={{ width: "100%", accentColor: "#0E5C4C" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", marginBottom: 20 }}>
        {[
          { label: "Needs %", value: needsPct, set: setNeedsPct, max: 80 },
          { label: "Wants %", value: wantsPct, set: setWantsPct, max: 60 },
        ].map(({ label, value, set, max }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#7a7a6e", fontFamily: "var(--font-sans)" }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0E5C4C", fontFamily: "var(--font-sans)" }}>{value}%</span>
            </div>
            <input type="range" min={10} max={max} step={5} value={value} onChange={(e) => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#0E5C4C" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Needs", value: `$${needs.toLocaleString()}`, pct: `${needsPct}%`, color: "#0E5C4C" },
          { label: "Wants", value: `$${wants.toLocaleString()}`, pct: `${wantsPct}%`, color: "#4A9B8A" },
          { label: "Savings", value: `$${savings.toLocaleString()}`, pct: `${savingsPct}%`, color: "#8FD4C6", highlight: savingsPct >= 20 },
        ].map(({ label, value, pct, color, highlight }) => (
          <div key={label} style={{
            textAlign: "center", padding: "12px 8px",
            backgroundColor: highlight ? "rgba(14,92,76,0.08)" : "#f8f6f0",
            borderRadius: 8,
            border: highlight ? "1px solid rgba(14,92,76,0.2)" : "1px solid #eae5db",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, margin: "0 auto 6px" }} />
            <div style={{ fontSize: 11, color: "#7a7a6e", fontFamily: "var(--font-sans)", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-sans)" }}>{value}</div>
            <div style={{ fontSize: 11, color, fontFamily: "var(--font-sans)" }}>{pct}</div>
          </div>
        ))}
      </div>

      {savingsPct < 10 && (
        <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: "rgba(217,83,79,0.07)", borderRadius: 8, fontSize: 12, color: "#d9534f", fontFamily: "var(--font-sans)", border: "1px solid rgba(217,83,79,0.15)" }}>
          ⚠️ Your savings allocation is below 10%. Try reducing wants to increase savings.
        </div>
      )}
    </div>
  );
}

/* ── Generic dispatcher ─────────────────────────────────── */

export function WilburChart(block: ChartBlock) {
  switch (block.chartType) {
    case "bar":    return <WilburBarChart {...block} />;
    case "pie":    return <WilburPieChart {...block} />;
    case "line":   return <CompoundGrowthChart />;
    case "compound-growth": return <CompoundGrowthChart title={block.title} subtitle={block.subtitle} />;
    default: return null;
  }
}
