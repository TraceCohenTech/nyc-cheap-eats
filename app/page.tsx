"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Clock, Map as MapIcon, AlignJustify, X, Heart, Shuffle, CalendarDays } from "lucide-react";
import { DEALS, CATS, type Deal } from "./data";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] sm:h-[620px] bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 text-sm">
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

function PriceBadge({ pr }: { pr: string }) {
  const v = extractPrice(pr);
  let cls = "";
  if (v === 0)   cls = "bg-emerald-950 text-emerald-300 border-emerald-800";
  else if (v <= 3)  cls = "bg-green-950 text-green-300 border-green-900";
  else if (v <= 5)  cls = "bg-lime-950 text-lime-300 border-lime-900";
  else if (v <= 10) cls = "bg-yellow-950 text-yellow-300 border-yellow-900";
  else if (v <= 15) cls = "bg-amber-950 text-amber-300 border-amber-900";
  else if (v <= 30) cls = "bg-orange-950 text-orange-300 border-orange-900";
  else cls = "bg-red-950 text-red-300 border-red-900";
  return (
    <span className={`border ${cls} px-2 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap flex-shrink-0`}>
      {pr}
    </span>
  );
}

// ─── Deal card ────────────────────────────────────────────────────────────────

function DealCard({
  d, isSaved, onToggleSave,
}: {
  d: Deal;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ci = CATS.find(c => c.k === d.c) || CATS[0];

  return (
    <article
      onClick={() => setOpen(o => !o)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/40 transition-all active:scale-[0.995]"
      style={{ borderLeft: `3px solid ${ci.cl}` }}
    >
      {/* Name + price + heart */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <span className="text-[15px] mt-0.5 leading-none flex-shrink-0">{ci.i}</span>
          <h3 className="font-semibold text-[14px] text-zinc-100 leading-snug">{d.n}</h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <PriceBadge pr={d.pr} />
          <button
            onClick={e => { e.stopPropagation(); onToggleSave(d.s); }}
            aria-label={isSaved ? "Unsave" : "Save"}
            className={`text-[18px] leading-none transition-all p-1 -m-1 min-w-[36px] min-h-[36px] flex items-center justify-center ${isSaved ? "text-red-400" : "text-zinc-700 hover:text-zinc-400"}`}
          >
            {isSaved ? "♥" : "♡"}
          </button>
        </div>
      </div>

      {/* Restaurant */}
      <p className="text-[12px] text-zinc-500 ml-6 mb-2 truncate">{d.p}</p>

      {/* Meta */}
      <div className="ml-6 flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
        <span className="flex items-center gap-0.5">
          <MapPin size={9} className="flex-shrink-0 text-zinc-600" />
          {d.h}
        </span>
        <span className="text-zinc-700">·</span>
        <span className="flex items-center gap-0.5">
          <Clock size={9} className="flex-shrink-0 text-zinc-600" />
          {d.hr}
        </span>
        <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-medium">{d.d}</span>
        {d.sc >= 9 && <span className="text-amber-400 text-[10px] font-bold">★ TOP VALUE</span>}
        {d.tr >= 9 && <span className="text-pink-400 text-[10px] font-bold">🔥 TRENDING</span>}
      </div>

      {/* Description */}
      <p className={`ml-6 mt-2 text-[12px] text-zinc-400 leading-relaxed ${open ? "" : "line-clamp-2"}`}>
        {d.desc}
      </p>
      {!open && d.desc.length > 110 && (
        <p className="ml-6 mt-0.5 text-[10px] text-zinc-700">tap to expand ↓</p>
      )}
    </article>
  );
}

// ─── Surprise modal ───────────────────────────────────────────────────────────

function SurpriseModal({ deal, onClose, isSaved, onToggleSave }: {
  deal: Deal;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  const ci = CATS.find(c => c.k === deal.c) || CATS[0];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        style={{ borderTop: `4px solid ${ci.cl}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{ci.i}</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={18} />
          </button>
        </div>
        <h2 className="font-serif text-2xl text-zinc-100 italic mb-1">{deal.n}</h2>
        <p className="text-zinc-500 text-sm mb-3">{deal.p}</p>
        <div className="flex gap-2 flex-wrap mb-4">
          <PriceBadge pr={deal.pr} />
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{deal.d}</span>
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{deal.hr}</span>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">{deal.desc}</p>
        <p className="text-zinc-600 text-xs mb-5 flex items-center gap-1">
          <MapPin size={10} /> {deal.h}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { onToggleSave(deal.s); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              isSaved
                ? "bg-red-950 text-red-300 border border-red-900"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {isSaved ? "♥ Saved" : "♡ Save"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
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
  const [showMap, setShowMap] = useState(false);
  const [surprise, setSurprise] = useState<Deal | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  // Load saved from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("nyc-saved") ?? "[]");
      setSaved(new Set(stored));
    } catch {}
  }, []);

  // Keyboard shortcuts: "/" to focus search, Escape to clear
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

  // Sync filters to URL for shareable links
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat !== "All") params.set("cat", cat);
    if (bor !== "All Boroughs") params.set("bor", bor);
    if (sort !== "cat") params.set("sort", sort);
    if (maxPrice !== "all") params.set("price", maxPrice);
    if (todayOnly) params.set("today", "1");
    const str = params.toString();
    window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
  }, [q, cat, bor, sort, maxPrice, todayOnly]);

  // Restore filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setQ(params.get("q")!);
    if (params.get("cat")) setCat(params.get("cat")!);
    if (params.get("bor")) setBor(params.get("bor")!);
    if (params.get("sort")) setSort(params.get("sort")!);
    if (params.get("price")) setMaxPrice(params.get("price")!);
    if (params.get("today") === "1") setTodayOnly(true);
  }, []);

  const toggleSave = useCallback((slug: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      localStorage.setItem("nyc-saved", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Precompute category counts (unfiltered, for badges)
  const catCounts = useMemo(() => {
    const m: Record<string, number> = { All: DEALS.length };
    CATS.slice(1).forEach(c => { m[c.k] = DEALS.filter(d => d.c === c.k).length; });
    return m;
  }, []);

  // Today info
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

  const hasFilters = q || cat !== "All" || bor !== "All Boroughs" || maxPrice !== "all" || todayOnly || savedOnly;

  function pickSurprise() {
    const pool = filtered.length > 0 ? filtered : DEALS;
    setSurprise(pool[Math.floor(Math.random() * pool.length)]);
  }

  function clearAll() {
    setQ(""); setCat("All"); setBor("All Boroughs");
    setMaxPrice("all"); setTodayOnly(false); setSavedOnly(false);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">

      {/* ═══ STICKY HEADER ═══ */}
      <div className="sticky top-0 z-30 bg-[#09090b]/96 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4">

          {/* Row 1: Brand + quick actions */}
          <div className="flex items-center gap-1.5 pt-3 pb-2">
            <h1 className="font-serif italic text-[17px] sm:text-[20px] text-zinc-100 leading-none tracking-tight">
              NYC Cheap Eats
            </h1>
            <span className="font-mono text-[10px] text-zinc-600 mr-auto">
              {filtered.length}/{DEALS.length}
            </span>

            {/* Today toggle */}
            <button
              onClick={() => setTodayOnly(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] font-bold transition-all min-h-[40px] ${
                todayOnly
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              title={`${todayCount} deals on ${todayName}`}
            >
              <CalendarDays size={11} />
              <span className="hidden xs:inline sm:inline">{todayOnly ? todayName : "Today"}</span>
              {!todayOnly && (
                <span className="bg-zinc-700 text-zinc-300 text-[9px] px-1 py-0.5 rounded-full font-mono">
                  {todayCount}
                </span>
              )}
            </button>

            {/* Saved toggle */}
            <button
              onClick={() => setSavedOnly(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] font-bold transition-all min-h-[40px] ${
                savedOnly
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              title="Your saved deals"
            >
              <Heart size={11} className={savedOnly ? "fill-current" : ""} />
              <span className="hidden xs:inline sm:inline">Saved</span>
              {saved.size > 0 && (
                <span className={`text-[9px] px-1 py-0.5 rounded-full font-mono ${savedOnly ? "bg-red-800 text-red-200" : "bg-zinc-700 text-zinc-300"}`}>
                  {saved.size}
                </span>
              )}
            </button>

            {/* Surprise */}
            <button
              onClick={pickSurprise}
              className="flex items-center justify-center w-10 rounded-lg text-[11px] font-bold bg-zinc-800 text-zinc-400 hover:bg-amber-500 hover:text-black transition-all min-h-[40px]"
              title="Random deal"
            >
              <Shuffle size={13} />
            </button>

            {/* Map toggle */}
            <button
              onClick={() => setShowMap(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] font-bold transition-all min-h-[40px] ${
                showMap ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {showMap ? <AlignJustify size={13} /> : <MapIcon size={13} />}
              {showMap ? "List" : "Map"}
            </button>
          </div>

          {/* Row 2: Search */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              ref={searchRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search deals, restaurants, neighborhoods…"
              className="w-full pl-8 pr-8 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-[14px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Row 3: Category pills with counts */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATS.map(c => (
              <button
                key={c.k}
                onClick={() => setCat(c.k)}
                className="flex-shrink-0 flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all min-h-[28px]"
                style={{
                  border: cat === c.k ? `1px solid ${c.cl}` : "1px solid #27272a",
                  background: cat === c.k ? `${c.cl}22` : "transparent",
                  color: cat === c.k ? c.cl : "#52525b",
                }}
              >
                <span>{c.i}</span>
                <span>{c.l}</span>
                {c.k !== "All" && (
                  <span
                    className="text-[9px] font-mono px-1 py-0.5 rounded-full ml-0.5"
                    style={{
                      background: cat === c.k ? `${c.cl}30` : "#27272a",
                      color: cat === c.k ? c.cl : "#52525b",
                    }}
                  >
                    {catCounts[c.k] ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Row 4: Price filter + borough + sort + clear */}
          <div className="flex gap-1.5 items-center pb-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all min-h-[36px] whitespace-nowrap ${
                  maxPrice === p.value
                    ? "bg-amber-500 text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {p.label}
              </button>
            ))}

            <div className="w-px h-4 bg-zinc-800 flex-shrink-0 mx-0.5" />

            <select
              value={bor}
              onChange={e => setBor(e.target.value)}
              className="flex-shrink-0 px-2 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 cursor-pointer outline-none focus:border-amber-500 min-h-[36px]"
            >
              {["All Boroughs","Manhattan","Brooklyn","Queens","Bronx","Staten Island","Citywide"].map(b => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="flex-shrink-0 px-2 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 cursor-pointer outline-none focus:border-amber-500 min-h-[36px]"
            >
              <option value="cat">Category</option>
              <option value="price">Price ↑</option>
              <option value="value">Best Value</option>
              <option value="trend">Trending</option>
            </select>

            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex-shrink-0 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors px-2 min-h-[36px]"
              >
                <X size={11} /> clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <main className="max-w-2xl mx-auto px-4 py-4">

        {showMap ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-zinc-500">
                {cat !== "All" ? cat : "All categories"} · click any dot for details
              </p>
              <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 cursor-pointer outline-none"
              >
                {CATS.map(c => <option key={c.k} value={c.k}>{c.i} {c.l}</option>)}
              </select>
            </div>
            <MapView filterCat={cat} />
            <p className="text-[10px] text-zinc-700 text-center mt-3">
              OpenStreetMap · CARTO dark tiles · no API key required
            </p>
          </div>
        ) : (
          <div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-600">
                <div className="text-4xl mb-3">🍕</div>
                <p className="text-sm mb-2">No deals match your filters.</p>
                <button onClick={clearAll} className="text-amber-400 text-xs hover:underline">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Today banner */}
            {todayOnly && filtered.length > 0 && (
              <div className="mb-4 px-4 py-2.5 bg-green-950/50 border border-green-900/50 rounded-xl text-sm text-green-300 flex items-center gap-2">
                <CalendarDays size={14} />
                <span>
                  <strong>{filtered.length} deals</strong> open on {todayName}
                </span>
              </div>
            )}

            {/* Saved banner */}
            {savedOnly && saved.size === 0 && (
              <div className="mb-4 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-400 text-center">
                No saved deals yet — tap ♡ on any deal to save it.
              </div>
            )}

            {sort === "cat" ? (
              // Grouped by category
              <div>
                {CATS.slice(1).map(c => {
                  const group = filtered.filter(d => d.c === c.k);
                  if (!group.length) return null;
                  return (
                    <div key={c.k} className="mb-8">
                      <div
                        className="flex items-center gap-2 mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${c.cl}22` }}
                      >
                        <span className="text-[15px] leading-none">{c.i}</span>
                        <h2 className="font-serif text-[16px] font-normal" style={{ color: c.cl }}>
                          {c.l}
                        </h2>
                        <span className="text-[11px] text-zinc-600 ml-auto font-mono">
                          {group.length} deal{group.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {group.map(d => (
                          <DealCard key={d.s} d={d} isSaved={saved.has(d.s)} onToggleSave={toggleSave} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Flat sorted list
              <div className="flex flex-col gap-2">
                {filtered.map(d => (
                  <DealCard key={d.s} d={d} isSaved={saved.has(d.s)} onToggleSave={toggleSave} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-zinc-800 py-6 px-4 text-center mt-8">
        <p className="text-xs text-zinc-600 mb-1">
          Prices verified May 2026 · Always call ahead — deals change without notice.
        </p>
        <p className="text-xs text-zinc-600 mb-3">
          Sources: Eater NY · The Infatuation · EatDrinkDeals · MurphGuide · SecretNYC · NY Post
        </p>
        <p className="text-sm text-zinc-500">
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Twitter</a>
          {" | "}
          <a href="mailto:t@nyvp.com" className="hover:text-amber-400 transition-colors">t@nyvp.com</a>
        </p>
      </footer>

      {/* ═══ SURPRISE MODAL ═══ */}
      {surprise && (
        <SurpriseModal
          deal={surprise}
          onClose={() => setSurprise(null)}
          isSaved={saved.has(surprise.s)}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
}
