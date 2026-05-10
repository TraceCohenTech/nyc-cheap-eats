"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Clock, Map as MapIcon, AlignJustify, X } from "lucide-react";
import { DEALS, CATS, type Deal } from "./data";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 text-sm">
      Loading map…
    </div>
  ),
});

function extractPrice(pr: string): number {
  if (!pr) return 999;
  if (pr.includes("FREE") || pr.includes("BOGO")) return 0;
  const m = pr.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 999;
}

function PriceBadge({ pr }: { pr: string }) {
  const v = extractPrice(pr);
  let cls = "";
  if (v === 0) cls = "bg-emerald-950 text-emerald-300 border-emerald-800";
  else if (v <= 3) cls = "bg-green-950 text-green-300 border-green-900";
  else if (v <= 5) cls = "bg-lime-950 text-lime-300 border-lime-900";
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

function DealCard({ d }: { d: Deal }) {
  const [open, setOpen] = useState(false);
  const ci = CATS.find(c => c.k === d.c) || CATS[0];

  return (
    <article
      onClick={() => setOpen(o => !o)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/50 transition-all active:scale-[0.995]"
      style={{ borderLeft: `3px solid ${ci.cl}` }}
    >
      {/* Name + price */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-[15px] mt-0.5 leading-none flex-shrink-0">{ci.i}</span>
          <h3 className="font-semibold text-[14px] text-zinc-100 leading-snug">{d.n}</h3>
        </div>
        <PriceBadge pr={d.pr} />
      </div>

      {/* Restaurant */}
      <p className="text-[12px] text-zinc-500 ml-6 mb-2 truncate">{d.p}</p>

      {/* Meta row */}
      <div className="ml-6 flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
        <span className="flex items-center gap-0.5">
          <MapPin size={9} className="flex-shrink-0" />
          {d.h}
        </span>
        <span className="text-zinc-700">·</span>
        <span className="flex items-center gap-0.5">
          <Clock size={9} className="flex-shrink-0" />
          {d.hr}
        </span>
        <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-medium leading-none">
          {d.d}
        </span>
        {d.sc >= 9 && (
          <span className="text-amber-400 text-[10px] font-bold leading-none">★ TOP VALUE</span>
        )}
        {d.tr >= 9 && (
          <span className="text-pink-400 text-[10px] font-bold leading-none">🔥 TRENDING</span>
        )}
      </div>

      {/* Description */}
      <p className={`ml-6 mt-2 text-[12px] text-zinc-400 leading-relaxed ${open ? "" : "line-clamp-2"}`}>
        {d.desc}
      </p>

      {/* Expand hint */}
      {!open && d.desc.length > 120 && (
        <p className="ml-6 mt-0.5 text-[10px] text-zinc-600">tap for more ↓</p>
      )}
    </article>
  );
}

export default function Page() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [bor, setBor] = useState("All Boroughs");
  const [sort, setSort] = useState("cat");
  const [showMap, setShowMap] = useState(false);

  const total = DEALS.length;

  const filtered = useMemo(() => {
    let r = DEALS.filter(d => {
      const s = q.toLowerCase();
      const ms = !s || [d.n, d.p, d.h, d.desc, d.c, d.d].some(f => f.toLowerCase().includes(s));
      const mc = cat === "All" || d.c === cat;
      const mb = bor === "All Boroughs" || d.b === bor || d.b === "Citywide";
      return ms && mc && mb;
    });
    if (sort === "price") r.sort((a, b) => extractPrice(a.pr) - extractPrice(b.pr));
    if (sort === "value") r.sort((a, b) => b.sc - a.sc);
    if (sort === "trend") r.sort((a, b) => b.tr - a.tr);
    return r;
  }, [q, cat, bor, sort]);

  const hasFilters = q || cat !== "All" || bor !== "All Boroughs";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">

      {/* ═══ STICKY HEADER ═══ */}
      <div className="sticky top-0 z-30 bg-[#09090b]/96 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4">

          {/* Brand + map toggle */}
          <div className="flex items-center justify-between pt-3 pb-2">
            <div className="flex items-baseline gap-2">
              <h1 className="font-serif italic text-[20px] text-zinc-100 leading-none tracking-tight">
                NYC Cheap Eats
              </h1>
              <span className="font-mono text-[11px] text-zinc-600">
                {filtered.length}/{total}
              </span>
            </div>
            <button
              onClick={() => setShowMap(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all min-h-[32px] ${
                showMap
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {showMap
                ? <><AlignJustify size={11} /> List</>
                : <><MapIcon size={11} /> 3D Map</>
              }
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search deals, restaurants, neighborhoods…"
              className="w-full pl-8 pr-8 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-[13px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category pills — horizontal scroll, no scrollbar */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATS.map(c => (
              <button
                key={c.k}
                onClick={() => setCat(c.k)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all min-h-[28px]"
                style={{
                  border: cat === c.k ? `1px solid ${c.cl}` : "1px solid #27272a",
                  background: cat === c.k ? `${c.cl}22` : "transparent",
                  color: cat === c.k ? c.cl : "#52525b",
                }}
              >
                {c.i} {c.l}
              </button>
            ))}
          </div>

          {/* Borough + sort + clear */}
          <div className="flex gap-2 items-center pb-2.5">
            <select
              value={bor}
              onChange={e => setBor(e.target.value)}
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 cursor-pointer outline-none focus:border-amber-500"
            >
              {["All Boroughs","Manhattan","Brooklyn","Queens","Bronx","Citywide"].map(b => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 cursor-pointer outline-none focus:border-amber-500"
            >
              <option value="cat">By Category</option>
              <option value="price">Price ↑</option>
              <option value="value">Best Value</option>
              <option value="trend">Trending</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => { setQ(""); setCat("All"); setBor("All Boroughs"); }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 ml-1"
              >
                <X size={10} /> clear
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
                Showing <span className="text-zinc-300 font-semibold">{cat === "All" ? "all categories" : cat}</span> — click any pin for details
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
              Requires <code className="text-amber-600">NEXT_PUBLIC_MAPBOX_TOKEN</code> · 3D buildings at zoom 13+
            </p>
          </div>
        ) : (
          <div>
            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-600">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm mb-2">No deals match your filters.</p>
                <button
                  onClick={() => { setQ(""); setCat("All"); setBor("All Boroughs"); }}
                  className="text-amber-400 text-xs hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Grouped by category (default) or flat list */}
            {sort === "cat" ? (
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
                        <span className="text-base leading-none">{c.i}</span>
                        <h2 className="font-serif text-[16px] font-normal" style={{ color: c.cl }}>
                          {c.l}
                        </h2>
                        <span className="text-[11px] text-zinc-600 ml-auto font-mono">
                          {group.length} deal{group.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {group.map(d => <DealCard key={d.s} d={d} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map(d => <DealCard key={d.s} d={d} />)}
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
          <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
            Twitter
          </a>
          {" | "}
          <a href="mailto:t@nyvp.com" className="hover:text-amber-400 transition-colors">
            t@nyvp.com
          </a>
        </p>
      </footer>
    </div>
  );
}
