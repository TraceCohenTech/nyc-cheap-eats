"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Search, MapPin, Clock, Star, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { DEALS, CATS, type Deal } from "./data";

function extractPrice(pr: string): number {
  if (!pr) return 999;
  if (pr.includes("FREE") || pr.includes("BOGO")) return 0;
  const m = pr.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 999;
}

function getPriceBracket(pr: string): string {
  const v = extractPrice(pr);
  if (v === 0) return "FREE";
  if (v <= 3) return "Under $3";
  if (v <= 5) return "$3–5";
  if (v <= 10) return "$5–10";
  if (v <= 15) return "$10–15";
  if (v <= 25) return "$15–25";
  return "$25+";
}

function PriceBadge({ pr }: { pr: string }) {
  const v = extractPrice(pr);
  let cls = "bg-green-950 text-green-300 border border-green-800";
  if (v === 0) cls = "bg-emerald-950 text-emerald-300 border border-emerald-700";
  else if (v <= 5) cls = "bg-green-950 text-green-300 border border-green-800";
  else if (v <= 10) cls = "bg-lime-950 text-lime-300 border border-lime-800";
  else if (v <= 15) cls = "bg-amber-950 text-amber-300 border border-amber-800";
  else if (v <= 30) cls = "bg-orange-950 text-orange-300 border border-orange-800";
  else cls = "bg-red-950 text-red-300 border border-red-900";
  return (
    <span className={`${cls} px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap flex-shrink-0`}>
      {pr}
    </span>
  );
}

const CUSTOM_TOOLTIP_STYLE = {
  contentStyle: {
    background: "#18181b",
    border: "1px solid #3f3f46",
    borderRadius: "8px",
    color: "#fafafa",
    fontSize: "12px",
  },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [bor, setBor] = useState("All Boroughs");
  const [sort, setSort] = useState("cat");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "directory">("overview");

  const totalDeals = DEALS.length;
  const under5 = DEALS.filter(d => extractPrice(d.pr) <= 5 && d.pr !== "Varies").length;
  const topValue = DEALS.filter(d => d.sc >= 9).length;
  const trendingCount = DEALS.filter(d => d.tr >= 9).length;
  const freeDealCount = DEALS.filter(d => extractPrice(d.pr) === 0).length;

  const catData = CATS.slice(1)
    .map(c => ({
      name: c.l,
      count: DEALS.filter(d => d.c === c.k).length,
      color: c.cl,
    }))
    .sort((a, b) => b.count - a.count);

  const boroughData = [
    { name: "Manhattan", count: DEALS.filter(d => d.b === "Manhattan").length, color: "#f59e0b" },
    { name: "Brooklyn", count: DEALS.filter(d => d.b === "Brooklyn").length, color: "#10b981" },
    { name: "Queens", count: DEALS.filter(d => d.b === "Queens").length, color: "#0ea5e9" },
    { name: "Citywide", count: DEALS.filter(d => d.b === "Citywide").length, color: "#ec4899" },
    { name: "Bronx", count: DEALS.filter(d => d.b === "Bronx").length, color: "#f97316" },
  ];

  const PRICE_ORDER = ["FREE", "Under $3", "$3–5", "$5–10", "$10–15", "$15–25", "$25+"];
  const PRICE_COLORS = ["#22c55e", "#4ade80", "#a3e635", "#facc15", "#fb923c", "#f87171", "#c084fc"];
  const priceData = PRICE_ORDER.map((bracket, i) => ({
    name: bracket,
    count: DEALS.filter(d => getPriceBracket(d.pr) === bracket).length,
    color: PRICE_COLORS[i],
  }));

  const topPicks = DEALS
    .filter(d => d.sc >= 9 || d.tr >= 9)
    .sort((a, b) => (b.sc + b.tr) - (a.sc + a.tr))
    .slice(0, 6);

  const filtered = useMemo(() => {
    let r = DEALS.filter(d => {
      const s = q.toLowerCase();
      const ms = !s ||
        d.n.toLowerCase().includes(s) ||
        d.p.toLowerCase().includes(s) ||
        d.h.toLowerCase().includes(s) ||
        d.desc.toLowerCase().includes(s) ||
        d.c.toLowerCase().includes(s) ||
        d.d.toLowerCase().includes(s);
      const mc = cat === "All" || d.c === cat;
      const mb = bor === "All Boroughs" || d.b === bor || d.b === "Citywide";
      return ms && mc && mb;
    });
    if (sort === "price") r.sort((a, b) => extractPrice(a.pr) - extractPrice(b.pr));
    if (sort === "value") r.sort((a, b) => (b.sc || 0) - (a.sc || 0));
    if (sort === "trend") r.sort((a, b) => (b.tr || 0) - (a.tr || 0));
    return r;
  }, [q, cat, bor, sort]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden border-b border-zinc-800"
        style={{ background: "linear-gradient(160deg,#18181b 0%,#09090b 40%,#1a0a05 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 px-4 py-10 sm:py-14 text-center max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[5px] uppercase text-amber-500 font-semibold mb-4">
            {totalDeals} DEALS · 14 CATEGORIES · UPDATED MAY 2026
          </p>
          <h1 className="font-serif text-[clamp(38px,8vw,72px)] font-normal italic leading-[1.05] tracking-tight mb-3">
            NYC Cheap Eats
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Every dollar slice, oyster happy hour, taco deal, wing wednesday, bottomless brunch,
            luxury loophole, and underpriced gem in New York City — so you never overpay for a meal again.
          </p>

          {/* Stats strip */}
          <div className="flex justify-center gap-5 sm:gap-10 flex-wrap mb-8">
            {[
              { n: totalDeals, l: "Total Deals" },
              { n: under5, l: "Under $5" },
              { n: freeDealCount, l: "Free Deals" },
              { n: 12, l: "Oyster Spots" },
              { n: topValue, l: "Top Value" },
              { n: trendingCount, l: "Trending" },
            ].map(s => (
              <div key={s.l} className="text-center min-w-[52px]">
                <div className="font-mono text-[clamp(20px,4vw,30px)] text-amber-400 font-bold leading-none">{s.n}</div>
                <div className="text-[9px] tracking-widest uppercase text-zinc-500 font-medium mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={15} />
            <input
              value={q}
              onChange={e => { setQ(e.target.value); setActiveTab("directory"); }}
              placeholder="Search deals, restaurants, neighborhoods, cuisines..."
              className="w-full pl-10 pr-4 py-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* ═══ TABS ═══ */}
      <div className="sticky top-0 z-20 bg-[#09090b] border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {(["overview", "directory"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab === "overview" ? "📊 Overview" : "🗂️ Directory"}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === "overview" && (
          <div className="space-y-8">

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Deals", value: totalDeals, sub: "across NYC", color: "text-amber-400" },
                { label: "Under $5", value: under5, sub: "budget picks", color: "text-green-400" },
                { label: "Top Value (★9+)", value: topValue, sub: "editorial best", color: "text-yellow-400" },
                { label: "Trending (🔥9+)", value: trendingCount, sub: "most viral", color: "text-pink-400" },
              ].map(k => (
                <div key={k.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className={`font-mono text-3xl font-bold ${k.color} leading-none`}>{k.value}</div>
                  <div className="text-zinc-100 text-sm font-semibold mt-1">{k.label}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Deals by Category */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h2 className="text-sm font-bold text-zinc-100 mb-0.5">Deals by Category</h2>
                <p className="text-xs text-zinc-500 mb-4">Number of deals in each food category</p>
                <div className="h-[300px] sm:h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={catData} layout="vertical" margin={{ left: 4, right: 20, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#a1a1aa", fontSize: 10 }}
                        width={72}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v) => [`${v} deals`, "Count"]} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
                        {catData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Borough + Price stacked */}
              <div className="flex flex-col gap-5">

                {/* Borough Distribution */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h2 className="text-sm font-bold text-zinc-100 mb-0.5">Borough Distribution</h2>
                  <p className="text-xs text-zinc-500 mb-3">Where the deals are concentrated</p>
                  <div className="flex items-center gap-4">
                    <div className="h-[120px] w-[120px] flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={boroughData}
                            cx="50%"
                            cy="50%"
                            innerRadius={32}
                            outerRadius={56}
                            dataKey="count"
                            strokeWidth={0}
                          >
                            {boroughData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v, n) => [`${v} deals`, n]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {boroughData.map(b => (
                        <div key={b.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
                          <span className="text-xs text-zinc-400 flex-1">{b.name}</span>
                          <span className="font-mono text-xs font-bold" style={{ color: b.color }}>{b.count}</span>
                          <span className="text-xs text-zinc-600">{Math.round(b.count / totalDeals * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Distribution */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h2 className="text-sm font-bold text-zinc-100 mb-0.5">Price Distribution</h2>
                  <p className="text-xs text-zinc-500 mb-3">Deals by price bracket</p>
                  <div className="h-[130px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priceData} margin={{ bottom: 16, top: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#a1a1aa", fontSize: 9 }}
                          axisLine={false}
                          tickLine={false}
                          angle={-25}
                          textAnchor="end"
                          height={36}
                        />
                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                        <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v) => [`${v} deals`, "Count"]} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
                          {priceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Value Scores */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-amber-400" />
                  <h2 className="text-sm font-bold text-zinc-100">Value Score Breakdown</h2>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Editorial value rating (1–10) across all {totalDeals} deals</p>
                <div className="space-y-2">
                  {[10, 9, 8, 7, 6].map(score => {
                    const count = DEALS.filter(d => d.sc === score).length;
                    const pct = Math.round(count / totalDeals * 100);
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="font-mono text-xs text-amber-400 font-bold w-10 text-right">{score}/10</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${pct}%`, opacity: 0.4 + score * 0.06 }}
                          />
                        </div>
                        <span className="font-mono text-xs text-zinc-300 w-6 text-right">{count}</span>
                        <span className="text-xs text-zinc-600 w-7">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-3">
                  <div className="flex-1 bg-amber-950/30 border border-amber-900/30 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-amber-400">{topValue}</div>
                    <div className="text-[10px] text-amber-600 mt-0.5">Score 9+</div>
                  </div>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-zinc-300">
                      {(DEALS.reduce((s, d) => s + d.sc, 0) / DEALS.length).toFixed(1)}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Avg Score</div>
                  </div>
                </div>
              </div>

              {/* Trending Scores */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-pink-400" />
                  <h2 className="text-sm font-bold text-zinc-100">Trending Score Breakdown</h2>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Editorial viral/trending score (1–10) across all deals</p>
                <div className="space-y-2">
                  {[10, 9, 8, 7, 6, 5].map(score => {
                    const count = DEALS.filter(d => d.tr === score).length;
                    const pct = Math.round(count / totalDeals * 100);
                    return (
                      <div key={score} className="flex items-center gap-3">
                        <span className="font-mono text-xs text-pink-400 font-bold w-10 text-right">{score}/10</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-pink-400"
                            style={{ width: `${pct}%`, opacity: 0.3 + score * 0.07 }}
                          />
                        </div>
                        <span className="font-mono text-xs text-zinc-300 w-6 text-right">{count}</span>
                        <span className="text-xs text-zinc-600 w-7">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-3">
                  <div className="flex-1 bg-pink-950/30 border border-pink-900/30 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-pink-400">{trendingCount}</div>
                    <div className="text-[10px] text-pink-600 mt-0.5">Score 9+</div>
                  </div>
                  <div className="flex-1 bg-green-950/30 border border-green-900/30 rounded-lg p-3 text-center">
                    <div className="font-mono text-xl font-bold text-green-400">
                      {DEALS.filter(d => d.sc >= 9 && d.tr >= 9).length}
                    </div>
                    <div className="text-[10px] text-green-600 mt-0.5">Both 9+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Picks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Top Picks</h2>
                  <p className="text-xs text-zinc-500">Highest combined value + trending score</p>
                </div>
                <button
                  onClick={() => setActiveTab("directory")}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topPicks.map(d => {
                  const ci = CATS.find(c => c.k === d.c) || CATS[0];
                  return (
                    <div
                      key={d.s}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/60 transition-colors"
                      style={{ borderLeft: `3px solid ${ci.cl}` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-[15px] text-zinc-100 font-normal leading-snug truncate">{d.n}</h3>
                          <div className="text-xs text-zinc-500 mt-0.5 truncate">{d.p}</div>
                        </div>
                        <PriceBadge pr={d.pr} />
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">{d.desc}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin size={10} className="text-zinc-600 flex-shrink-0" />
                        <span className="text-zinc-500 flex-1 truncate">{d.h}</span>
                        <span className="text-amber-400 font-bold font-mono">★{d.sc}</span>
                        <span className="text-pink-400 font-bold font-mono">🔥{d.tr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ DIRECTORY TAB ═══ */}
        {activeTab === "directory" && (
          <div>
            {/* Category Pills */}
            <nav className="flex gap-1.5 flex-wrap mb-3 pb-3 border-b border-zinc-800">
              {CATS.map(c => (
                <button
                  key={c.k}
                  onClick={() => setCat(c.k)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all min-h-[32px] flex items-center gap-1"
                  style={{
                    border: cat === c.k ? `1px solid ${c.cl}` : "1px solid #27272a",
                    background: cat === c.k ? `${c.cl}18` : "transparent",
                    color: cat === c.k ? c.cl : "#71717a",
                  }}
                >
                  <span>{c.i}</span> {c.l}
                </button>
              ))}
            </nav>

            {/* Sub-filters */}
            <div className="flex gap-2 flex-wrap mb-5 items-center">
              <select
                value={bor}
                onChange={e => setBor(e.target.value)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300 cursor-pointer outline-none focus:border-amber-500"
              >
                {["All Boroughs", "Manhattan", "Brooklyn", "Queens", "Bronx", "Citywide"].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300 cursor-pointer outline-none focus:border-amber-500"
              >
                <option value="cat">Sort: Category</option>
                <option value="price">Sort: Price ↑</option>
                <option value="value">Sort: Best Value</option>
                <option value="trend">Sort: Trending</option>
              </select>
              <span className="ml-auto font-mono text-xs text-zinc-600">
                {filtered.length}/{totalDeals}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <div className="text-center py-20 text-zinc-600">
                  <div className="text-5xl mb-4">🍕</div>
                  <p className="text-sm">No deals match — try broadening your search.</p>
                </div>
              )}
              {(() => {
                let last = "";
                return filtered.map((d, i) => {
                  const ci = CATS.find(c => c.k === d.c) || CATS[0];
                  const showHeader = sort === "cat" && d.c !== last;
                  last = d.c;
                  const key = d.s || String(i);
                  const isOpen = expanded === key;
                  return (
                    <div key={key}>
                      {showHeader && (
                        <h3
                          className="font-serif text-lg font-normal flex items-center gap-2 mt-6 mb-2 pb-2"
                          style={{ color: ci.cl, borderBottom: `1px solid ${ci.cl}22` }}
                        >
                          <span>{ci.i}</span>
                          {ci.l}
                          <span className="text-xs text-zinc-600 font-sans ml-auto font-normal">
                            {filtered.filter(x => x.c === d.c).length} deals
                          </span>
                        </h3>
                      )}
                      <article
                        onClick={() => setExpanded(isOpen ? null : key)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 cursor-pointer transition-all hover:bg-zinc-800/50 hover:border-zinc-700"
                        style={{ borderLeft: `3px solid ${ci.cl}` }}
                      >
                        <div className="flex justify-between items-start gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[15px] text-zinc-100 font-normal leading-snug">{d.n}</h4>
                            <div className="text-xs text-zinc-500 mt-0.5">{d.p}</div>
                          </div>
                          <div className="flex gap-1.5 items-center flex-wrap flex-shrink-0">
                            <PriceBadge pr={d.pr} />
                            <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{d.d}</span>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-1.5 text-xs text-zinc-600 flex-wrap items-center">
                          <span className="flex items-center gap-1"><MapPin size={9} />{d.h}</span>
                          <span className="flex items-center gap-1"><Clock size={9} />{d.hr}</span>
                          {d.sc >= 9 && <span className="text-amber-400 font-bold text-[10px]">★ TOP VALUE</span>}
                          {d.tr >= 9 && <span className="text-pink-400 font-bold text-[10px]">🔥 TRENDING</span>}
                          <span className="ml-auto text-zinc-700">
                            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </span>
                        </div>
                        {isOpen && (
                          <div className="mt-3 pt-3 border-t border-zinc-800">
                            <p className="text-[13px] text-zinc-400 leading-relaxed">{d.desc}</p>
                            <div className="flex gap-4 mt-2 text-[11px] text-zinc-600">
                              <span>Value: <span className="text-amber-400 font-bold">{d.sc}/10</span></span>
                              <span>Trending: <span className="text-pink-400 font-bold">{d.tr}/10</span></span>
                              <span>Borough: <span className="text-zinc-400">{d.b}</span></span>
                            </div>
                          </div>
                        )}
                      </article>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-zinc-800 py-8 px-4 text-center mt-8">
        <p className="text-xs text-zinc-600 mb-1">Prices verified May 2026. Always call ahead — deals change without notice.</p>
        <p className="text-xs text-zinc-600 mb-4">
          Data from Eater NY, The Infatuation, Yelp, EatDrinkDeals, MurphGuide, Happy-Hour.nyc, SecretNYC, Resy, NY Post, and direct restaurant sites.
        </p>
        <p className="text-sm text-zinc-500">
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Twitter</a>
          {" | "}
          <a href="mailto:t@nyvp.com" className="hover:text-amber-400 transition-colors">t@nyvp.com</a>
        </p>
      </footer>
    </div>
  );
}
