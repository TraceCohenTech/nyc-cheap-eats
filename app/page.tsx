"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Clock, LayoutGrid, Map as MapIcon, X, Heart, Shuffle, CalendarDays } from "lucide-react";
import { DEALS, CATS, type Deal } from "./data";
import { DEAL_COORDS } from "./coordinates";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 text-sm">
      Loading map…
    </div>
  ),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractPrice(pr: string): number {
  if (!pr) return 999;
  if (pr.includes("FREE") || pr.includes("BOGO")) return 0;
  const m = pr.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 999;
}

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_KEYWORDS: Record<number, string[]> = {
  0: ["Sunday","Sun","Sat–Sun","Weekend","Sat & Sun"],
  1: ["Monday","Mon","Mon–Fri","Mon–Thu","Weekdays","Weekday"],
  2: ["Tuesday","Tue","Tue & Wed","Mon–Fri","Weekdays","Weekday"],
  3: ["Wednesday","Wed","Tue & Wed","Mon–Fri","Weekdays","Weekday"],
  4: ["Thursday","Thu","Mon–Fri","Weekdays","Weekday"],
  5: ["Friday","Fri","Mon–Fri","Weekdays","Weekday"],
  6: ["Saturday","Sat","Sat–Sun","Weekend","Sat & Sun"],
};

function isDealToday(d: Deal): boolean {
  const day = new Date().getDay();
  const keywords = DAY_KEYWORDS[day] ?? [];
  const field = d.d.toLowerCase();
  if (field.includes("every day") || field.includes("daily") || field.includes("year-round") || field.includes("varies")) return true;
  return keywords.some(k => d.d.includes(k));
}

// ─── Price badge ──────────────────────────────────────────────────────────────

function PriceBadge({ pr, large }: { pr: string; large?: boolean }) {
  const v = extractPrice(pr);
  let cls = "";
  if (v === 0)        cls = "bg-emerald-950 text-emerald-300 border-emerald-700";
  else if (v <= 3)    cls = "bg-green-950 text-green-300 border-green-800";
  else if (v <= 5)    cls = "bg-lime-950 text-lime-300 border-lime-800";
  else if (v <= 10)   cls = "bg-yellow-950 text-yellow-200 border-yellow-800";
  else if (v <= 15)   cls = "bg-amber-950 text-amber-200 border-amber-800";
  else if (v <= 30)   cls = "bg-orange-950 text-orange-300 border-orange-800";
  else                cls = "bg-red-950 text-red-300 border-red-800";
  return (
    <span className={`border ${cls} px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap flex-shrink-0 ${large ? "text-[13px]" : "text-[11px]"}`}>
      {pr}
    </span>
  );
}

// ─── Deal Card (compact square) ───────────────────────────────────────────────

function DealCard({
  d, catColor, catEmoji, isSaved, onClick,
}: {
  d: Deal;
  catColor: string;
  catEmoji: string;
  isSaved: boolean;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/70 transition-all active:scale-[0.97] flex flex-col h-56"
      style={{ borderTop: `3px solid ${catColor}` }}
    >
      {isSaved && (
        <span className="absolute top-3 right-3 text-red-400 text-[13px] leading-none">♥</span>
      )}

      <div className="flex items-start justify-between mb-2.5">
        <span className="text-2xl leading-none">{catEmoji}</span>
        <PriceBadge pr={d.pr} />
      </div>

      <h3 className="font-bold text-[14px] sm:text-[15px] text-white leading-snug line-clamp-2 mb-1.5">{d.n}</h3>
      <p className="text-[12px] text-zinc-300 truncate mb-1">{d.p}</p>
      <p className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
        <MapPin size={9} className="flex-shrink-0 text-zinc-500" />{d.h}
      </p>

      <div className="mt-auto pt-2.5 space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          <Clock size={9} className="flex-shrink-0 text-zinc-500" />
          <span className="truncate">{d.hr}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="bg-zinc-800 text-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-medium truncate max-w-[80%]">{d.d}</span>
          <div className="flex gap-1 flex-shrink-0">
            {d.sc >= 9 && <span className="text-amber-400 text-[11px]">★</span>}
            {d.tr >= 9 && <span className="text-[11px]">🔥</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Deal Modal (bottom sheet) ────────────────────────────────────────────────

function DealModal({ deal, onClose, isSaved, onToggleSave }: {
  deal: Deal;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  const ci = CATS.find(c => c.k === deal.c) || CATS[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderTop: `4px solid ${ci.cl}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* mobile drag handle */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl flex-shrink-0">{ci.i}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[20px] text-white leading-tight mb-0.5">{deal.n}</h2>
            <p className="text-[14px] text-zinc-300">{deal.p}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <PriceBadge pr={deal.pr} large />
          <span className="bg-zinc-800 text-zinc-200 text-[12px] px-3 py-1 rounded-full font-medium">{deal.d}</span>
          <span className="bg-zinc-800 text-zinc-200 text-[12px] px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <Clock size={10} />{deal.hr}
          </span>
        </div>

        <p className="text-zinc-300 text-[14px] leading-relaxed mb-4">{deal.desc}</p>

        <p className="text-zinc-400 text-[13px] flex items-center gap-1.5 mb-4">
          <MapPin size={12} className="text-zinc-500" /> {deal.h}
        </p>

        {(deal.sc >= 9 || deal.tr >= 9) && (
          <div className="flex gap-3 mb-5 py-2 border-t border-zinc-800">
            {deal.sc >= 9 && <span className="text-amber-400 text-[13px] font-bold">★ TOP VALUE</span>}
            {deal.tr >= 9 && <span className="text-pink-400 text-[13px] font-bold">🔥 TRENDING</span>}
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => onToggleSave(deal.s)}
            className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all ${
              isSaved
                ? "bg-red-950 text-red-300 border border-red-800"
                : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            {isSaved ? "♥ Saved" : "♡ Save deal"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[14px] font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            Got it 👍
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [bor, setBor] = useState("All Boroughs");
  const [sort, setSort] = useState("cat");
  const [maxPrice, setMaxPrice] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [view, setView] = useState<"bento" | "map">("bento");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("nyc-saved") ?? "[]");
      setSaved(new Set(stored));
    } catch {}
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQ("");
        searchRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat !== "All") params.set("cat", cat);
    if (bor !== "All Boroughs") params.set("bor", bor);
    if (sort !== "cat") params.set("sort", sort);
    if (maxPrice !== "all") params.set("price", maxPrice);
    if (todayOnly) params.set("today", "1");
    if (view !== "bento") params.set("view", view);
    const str = params.toString();
    window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
  }, [q, cat, bor, sort, maxPrice, todayOnly, view]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setQ(params.get("q")!);
    if (params.get("cat")) setCat(params.get("cat")!);
    if (params.get("bor")) setBor(params.get("bor")!);
    if (params.get("sort")) setSort(params.get("sort")!);
    if (params.get("price")) setMaxPrice(params.get("price")!);
    if (params.get("today") === "1") setTodayOnly(true);
    if (params.get("view") === "map") setView("map");
  }, []);

  const toggleSave = useCallback((slug: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      localStorage.setItem("nyc-saved", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = { All: DEALS.length };
    CATS.slice(1).forEach(c => { m[c.k] = DEALS.filter(d => d.c === c.k).length; });
    return m;
  }, []);

  const todayName = DAY_NAMES[new Date().getDay()];
  const todayCount = useMemo(() => DEALS.filter(isDealToday).length, []);

  const filtered = useMemo(() => {
    let r = DEALS.filter(d => {
      const s = q.toLowerCase();
      const ms = !s || [d.n, d.p, d.h, d.desc, d.c, d.d].some(f => f.toLowerCase().includes(s));
      const mc = cat === "All" || d.c === cat;
      const mb = bor === "All Boroughs" || d.b === bor || d.b === "Citywide";
      const v = extractPrice(d.pr);
      const mp =
        maxPrice === "all" ? true :
        maxPrice === "0"   ? v === 0 :
        v <= parseInt(maxPrice);
      const mt = !todayOnly || isDealToday(d);
      const ms2 = !savedOnly || saved.has(d.s);
      return ms && mc && mb && mp && mt && ms2;
    });
    if (sort === "price") r.sort((a, b) => extractPrice(a.pr) - extractPrice(b.pr));
    if (sort === "value") r.sort((a, b) => b.sc - a.sc);
    if (sort === "trend") r.sort((a, b) => b.tr - a.tr);
    return r;
  }, [q, cat, bor, sort, maxPrice, todayOnly, savedOnly, saved]);

  const mappedDeals = useMemo(() =>
    filtered.filter(d => (d.lat !== undefined && d.lng !== undefined) || d.s in DEAL_COORDS),
  [filtered]);

  const hasFilters = q || cat !== "All" || bor !== "All Boroughs" || maxPrice !== "all" || todayOnly || savedOnly;

  function pickSurprise() {
    const pool = filtered.length > 0 ? filtered : DEALS;
    setSelectedDeal(pool[Math.floor(Math.random() * pool.length)]);
  }

  function clearAll() {
    setQ(""); setCat("All"); setBor("All Boroughs");
    setMaxPrice("all"); setTodayOnly(false); setSavedOnly(false);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">

      {/* ═══ STICKY HEADER ═══ */}
      <div className="sticky top-0 z-30 bg-[#09090b]/96 backdrop-blur-sm border-b border-zinc-800">
        <div className="mx-auto px-4 lg:px-8 max-w-screen-xl">

          {/* Row 1: Brand + actions */}
          <div className="flex items-center gap-2 pt-3 pb-2">
            <h1 className="font-serif italic text-[18px] sm:text-[22px] text-white leading-none tracking-tight mr-auto">
              NYC Cheap Eats
            </h1>
            <span className="font-mono text-[11px] text-zinc-500 hidden sm:block">
              {filtered.length}/{DEALS.length}
            </span>

            <button
              onClick={() => setTodayOnly(v => !v)}
              title={`${todayCount} deals today`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                todayOnly ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <CalendarDays size={13} />
              <span className="hidden sm:inline">{todayOnly ? todayName : "Today"}</span>
              {!todayOnly && (
                <span className="bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{todayCount}</span>
              )}
            </button>

            <button
              onClick={() => setSavedOnly(v => !v)}
              title="Saved deals"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                savedOnly ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <Heart size={13} className={savedOnly ? "fill-current" : ""} />
              <span className="hidden sm:inline">Saved</span>
              {saved.size > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${savedOnly ? "bg-red-700 text-red-100" : "bg-zinc-700 text-zinc-300"}`}>
                  {saved.size}
                </span>
              )}
            </button>

            <button
              onClick={pickSurprise}
              title="Random deal"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-amber-500 hover:text-black transition-all"
            >
              <Shuffle size={14} />
            </button>

            <div className="flex bg-zinc-800 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setView("bento")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  view === "bento" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  view === "map" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <MapIcon size={13} />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

          {/* Row 2: Search */}
          <div className="relative mb-2.5">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              ref={searchRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search deals, restaurants, neighborhoods…"
              className="w-full pl-10 pr-9 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-[14px] text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Row 3: Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATS.map(c => (
              <button
                key={c.k}
                onClick={() => setCat(c.k)}
                className="flex-shrink-0 flex items-center gap-1 pl-2.5 pr-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all"
                style={{
                  border: cat === c.k ? `1px solid ${c.cl}` : "1px solid #3f3f46",
                  background: cat === c.k ? `${c.cl}22` : "transparent",
                  color: cat === c.k ? c.cl : "#a1a1aa",
                }}
              >
                <span>{c.i}</span>
                <span>{c.l}</span>
                {c.k !== "All" && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-full ml-0.5"
                    style={{
                      background: cat === c.k ? `${c.cl}30` : "#3f3f46",
                      color: cat === c.k ? c.cl : "#71717a",
                    }}
                  >
                    {catCounts[c.k] ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Row 4: Price + borough + sort + clear */}
          <div className="flex gap-2 items-center pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "Any $", value: "all" },
              { label: "FREE", value: "0" },
              { label: "≤$5", value: "5" },
              { label: "≤$10", value: "10" },
              { label: "≤$15", value: "15" },
            ].map(p => (
              <button
                key={p.value}
                onClick={() => setMaxPrice(p.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap ${
                  maxPrice === p.value
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="w-px h-4 bg-zinc-700 flex-shrink-0" />
            <select
              value={bor}
              onChange={e => setBor(e.target.value)}
              className="flex-shrink-0 px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none focus:border-amber-500"
            >
              {["All Boroughs","Manhattan","Brooklyn","Queens","Bronx","Staten Island","Citywide"].map(b => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="flex-shrink-0 px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none focus:border-amber-500"
            >
              <option value="cat">Category</option>
              <option value="price">Price ↑</option>
              <option value="value">Best Value</option>
              <option value="trend">Trending</option>
            </select>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex-shrink-0 flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white transition-colors px-2"
              >
                <X size={12} /> clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <main className="mx-auto px-4 lg:px-8 py-5 max-w-screen-xl">

        {view === "map" ? (
          /* ── MAP VIEW ── */
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] text-zinc-300">
                <span className="text-white font-semibold">{mappedDeals.length}</span> deals plotted · tap any dot for details
              </p>
              <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none hover:border-zinc-500"
              >
                {CATS.map(c => <option key={c.k} value={c.k}>{c.i} {c.l}</option>)}
              </select>
            </div>

            <MapView filterCat={cat} />

            <p className="text-[11px] text-zinc-600 text-center mt-2 mb-6">
              OpenStreetMap · CARTO dark tiles · no API key required
            </p>

            {mappedDeals.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                  <MapPin size={13} className="text-amber-500" />
                  Deals on the map
                  <span className="font-mono text-zinc-500 font-normal text-[12px]">{mappedDeals.length}</span>
                </p>
                <div className="-mx-4 px-4 flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {mappedDeals.map(d => {
                    const ci = CATS.find(ct => ct.k === d.c) || CATS[0];
                    return (
                      <div
                        key={d.s}
                        onClick={() => setSelectedDeal(d)}
                        className="flex-shrink-0 w-52 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-500 transition-colors cursor-pointer flex flex-col h-56"
                        style={{ borderTop: `2px solid ${ci.cl}` }}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-2xl leading-none">{ci.i}</span>
                          <PriceBadge pr={d.pr} />
                        </div>
                        <p className="font-bold text-[14px] text-white line-clamp-2 mb-1.5 leading-snug">{d.n}</p>
                        <p className="text-[12px] text-zinc-300 truncate mb-1">{d.p}</p>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
                          <MapPin size={9} className="flex-shrink-0 text-zinc-500" />{d.h}
                        </p>
                        <div className="mt-auto pt-2.5 space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <Clock size={9} className="flex-shrink-0 text-zinc-500" />
                            <span className="truncate">{d.hr}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="bg-zinc-800 text-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-medium">{d.d}</span>
                            {(d.sc >= 9 || d.tr >= 9) && (
                              <span className="text-[11px]">{d.sc >= 9 && "★"}{d.tr >= 9 && "🔥"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── GRID VIEW ── */
          <div>
            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🍕</div>
                <p className="text-base text-zinc-300 mb-3">No deals match your filters.</p>
                <button onClick={clearAll} className="text-amber-400 text-sm hover:underline">
                  Clear all filters
                </button>
              </div>
            )}

            {todayOnly && filtered.length > 0 && (
              <div className="mb-5 px-4 py-3 bg-green-950/60 border border-green-800 rounded-xl text-[14px] text-green-300 flex items-center gap-2">
                <CalendarDays size={15} />
                <span><strong>{filtered.length} deals</strong> open today · {todayName}</span>
              </div>
            )}

            {savedOnly && saved.size === 0 && (
              <div className="mb-5 px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-[14px] text-zinc-300 text-center">
                No saved deals yet — tap any card then ♡ to save it.
              </div>
            )}

            {sort === "cat" ? (
              <div className="space-y-8">
                {CATS.slice(1).map(c => {
                  const group = filtered.filter(d => d.c === c.k);
                  if (!group.length) return null;
                  return (
                    <div key={c.k}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base leading-none">{c.i}</span>
                        <h2 className="font-bold text-[15px]" style={{ color: c.cl }}>{c.l}</h2>
                        <span className="text-zinc-500 text-[12px] font-mono ml-1">{group.length}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                        {group.map(d => (
                          <DealCard
                            key={d.s}
                            d={d}
                            catColor={c.cl}
                            catEmoji={c.i}
                            isSaved={saved.has(d.s)}
                            onClick={() => setSelectedDeal(d)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                {filtered.map(d => {
                  const ci = CATS.find(ct => ct.k === d.c) || CATS[0];
                  return (
                    <DealCard
                      key={d.s}
                      d={d}
                      catColor={ci.cl}
                      catEmoji={ci.i}
                      isSaved={saved.has(d.s)}
                      onClick={() => setSelectedDeal(d)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-zinc-800 py-8 px-4 text-center mt-10">
        <p className="text-[13px] text-zinc-500 mb-1">
          Prices verified May 2026 · Always call ahead — deals change without notice.
        </p>
        <p className="text-[12px] text-zinc-600 mb-4">
          Sources: Eater NY · The Infatuation · EatDrinkDeals · MurphGuide · SecretNYC · NY Post
        </p>
        <p className="text-[13px] text-zinc-400">
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Twitter</a>
          {" · "}
          <a href="mailto:t@nyvp.com" className="hover:text-amber-400 transition-colors">t@nyvp.com</a>
        </p>
      </footer>

      {selectedDeal && (
        <DealModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          isSaved={saved.has(selectedDeal.s)}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
}
