"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Clock, LayoutGrid, Map as MapIcon, X, Heart, Shuffle, CalendarDays, Zap, CheckCircle } from "lucide-react";
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

// ─── Category photos (Unsplash) ───────────────────────────────────────────────

const CAT_IMAGES: Record<string, string> = {
  "Dollar Eats":          "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=200&fit=crop&q=70",
  "Cheap Eats":           "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=200&fit=crop&q=70",
  "$1 Oyster Deals":      "https://images.unsplash.com/photo-1612871689775-2f68dfee4e5e?w=600&h=200&fit=crop&q=70",
  "Taco Tuesday":         "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=200&fit=crop&q=70",
  "Wing Wednesday":       "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=200&fit=crop&q=70",
  "Burger Deals":         "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=200&fit=crop&q=70",
  "Happy Hour Food":      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=200&fit=crop&q=70",
  "Bottomless Brunch":    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=200&fit=crop&q=70",
  "Hot Restaurant Value": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=200&fit=crop&q=70",
  "Luxury Loophole":      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=200&fit=crop&q=70",
  "Street Food & Markets":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=200&fit=crop&q=70",
  "Pizza Slice Value":    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=200&fit=crop&q=70",
  "Fast Food Value":      "https://images.unsplash.com/photo-1561758033-7e924a3e18ed?w=600&h=200&fit=crop&q=70",
  "Prix Fixe Lunch":      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=200&fit=crop&q=70",
  "Seasonal":             "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=200&fit=crop&q=70",
  "Workspace":            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=200&fit=crop&q=70",
  "Free Events":          "https://images.unsplash.com/photo-1501281668745-f7f57925c2b1?w=600&h=200&fit=crop&q=70",
  "Late Night":           "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=200&fit=crop&q=70",
  "Dim Sum":              "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=200&fit=crop&q=70",
};

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

function isOpenNow(hr: string): boolean {
  const s = hr.toLowerCase().replace(/\([^)]+\)/g, "").trim();
  if (s.includes("all day") || s.includes("24 hour")) return true;
  if (s.includes("varies") || s.includes("seasonal") || s.includes("weather")) return true;

  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const inRange = (open: number, close: number) =>
    open <= close ? cur >= open && cur < close : cur >= open || cur < (close % (24 * 60));

  // Named periods
  if (s.startsWith("morning") || (s.includes("breakfast") && !s.includes("lunch"))) return inRange(6*60, 12*60);
  if (s.includes("breakfast") && s.includes("lunch")) return inRange(7*60, 15*60);
  if (s.includes("lunch") && s.includes("dinner")) return inRange(11*60, 22*60);
  if (s.includes("lunch") && !s.includes("dinner")) return inRange(11*60, 15*60);
  if (s.includes("dinner") && !s.includes("lunch")) return inRange(17*60, 22*60);
  if (s.includes("brunch")) return inRange(10*60, 16*60);
  if (s.includes("happy hour")) return inRange(16*60, 20*60);
  if (s.includes("late night") || s.includes("late-night")) return inRange(22*60, 30*60);
  if (s.includes("afternoon")) return inRange(12*60, 17*60);
  if (s.includes("evening")) return inRange(17*60, 23*60);

  // "open–Xpm"
  const openUntil = s.match(/^open[–\-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (openUntil) {
    let h = parseInt(openUntil[1]), m = parseInt(openUntil[2] ?? "0");
    const ap = openUntil[3] || "pm";
    if (ap === "pm" && h !== 12) h += 12;
    return inRange(0, h * 60 + m);
  }

  // "until X"
  const untilM = s.match(/until\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (untilM) {
    let h = parseInt(untilM[1]), m = parseInt(untilM[2] ?? "0");
    const ap = untilM[3] || (h < 8 ? "am" : "pm");
    if (ap === "pm" && h !== 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    const close = h * 60 + m;
    return ap === "am" || close < 10*60 ? inRange(17*60, close) : inRange(0, close);
  }

  // Time range "H:MM am/pm – H:MM am/pm"
  const rangeM = s.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[–\-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|midnight)?/);
  if (!rangeM) return true;
  const [, oh, om, oap, ch, cm, cap] = rangeM;

  let closeVal: number;
  if (cap === "midnight") {
    closeVal = 24 * 60;
  } else {
    let cH = parseInt(ch), cM = parseInt(cm ?? "0");
    if ((cap as string) === "pm" && cH !== 12) cH += 12;
    if ((cap as string) === "am" && cH === 12) cH = 0;
    closeVal = cH * 60 + cM;
  }

  let oH = parseInt(oh), oM = parseInt(om ?? "0");
  if (oap === "pm" && oH !== 12) oH += 12;
  else if (oap === "am" && oH === 12) oH = 0;
  else if (!oap) {
    const chInt = parseInt(ch);
    if (cap === "pm" && oH < chInt) oH += 12;
    else if (!cap && closeVal > 12 * 60 && oH < 12) oH += 12;
  }
  return inRange(oH * 60 + oM, closeVal);
}

function getDealOfTheDay(): Deal {
  const top = DEALS.filter(d => d.sc >= 9);
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return top[seed % top.length];
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

// ─── Category Hero Banner ─────────────────────────────────────────────────────

function CategoryHero({ cat, count }: { cat: typeof CATS[0]; count: number }) {
  const img = CAT_IMAGES[cat.k];
  return (
    <div className="relative h-24 rounded-xl overflow-hidden mb-4" style={{ outline: `1px solid ${cat.cl}30` }}>
      {img && <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-zinc-950/30" />
      <div className="absolute inset-0 flex items-center px-5 gap-4">
        <span className="text-3xl drop-shadow">{cat.i}</span>
        <h2 className="font-bold text-[18px] text-white flex-1 leading-tight">{cat.l}</h2>
        <span className="font-mono text-[11px] text-zinc-400 bg-zinc-900/70 px-2.5 py-1 rounded-full border border-zinc-700/50">
          {count} deals
        </span>
      </div>
    </div>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealCard({
  d, catColor, catEmoji, isSaved, isTried, onClick,
}: {
  d: Deal;
  catColor: string;
  catEmoji: string;
  isSaved: boolean;
  isTried: boolean;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="relative bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/60 transition-all active:scale-[0.97] flex flex-col overflow-hidden"
      style={{ borderTop: `3px solid ${catColor}` }}
    >
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-base leading-none flex-shrink-0">{catEmoji}</span>
            <h3 className="font-bold text-[13px] sm:text-[14px] text-white leading-snug line-clamp-2">{d.n}</h3>
          </div>
          {isTried && (
            <span className="flex-shrink-0 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ml-1">
              <CheckCircle size={7} />Tried
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-300 truncate mb-1">{d.p}</p>
        <p className="text-[10px] text-zinc-400 flex items-center gap-1 truncate mb-auto">
          <MapPin size={8} className="flex-shrink-0 text-zinc-500" />{d.h}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-1 flex-wrap">
          <PriceBadge pr={d.pr} />
          <span className="bg-zinc-800 text-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-medium truncate max-w-[55%]">{d.d}</span>
        </div>
        <div className="flex gap-1.5 mt-1.5 items-center">
          {d.sc >= 9 && <span className="text-amber-400 text-[11px]">★</span>}
          {d.tr >= 9 && <span className="text-[11px]">🔥</span>}
          {isSaved && <span className="text-red-400 text-[11px] ml-auto">♥</span>}
        </div>
      </div>
    </article>
  );
}

// ─── Deal of the Day hero ─────────────────────────────────────────────────────

function DealOfTheDayCard({ deal, isSaved, isTried, onClick }: {
  deal: Deal;
  isSaved: boolean;
  isTried: boolean;
  onClick: () => void;
}) {
  const ci = CATS.find(c => c.k === deal.c) || CATS[0];
  const img = CAT_IMAGES[deal.c];
  const todayName = DAY_NAMES[new Date().getDay()];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-amber-400" />
        <span className="text-[12px] font-bold text-amber-400 uppercase tracking-widest">Deal of the Day</span>
        <span className="text-zinc-600 text-[11px]">· {todayName}</span>
      </div>
      <article
        onClick={onClick}
        className="relative rounded-2xl overflow-hidden cursor-pointer border border-amber-500/20 hover:border-amber-500/50 transition-all"
        style={{ borderTop: `4px solid ${ci.cl}` }}
      >
        {/* Background image */}
        <div className="relative h-52 sm:h-64">
          {img && <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-zinc-950/30" />
          <div className="absolute inset-0 flex items-center p-5 sm:p-8">
            <div className="max-w-lg">
              <div className="text-4xl mb-3">{ci.i}</div>
              <h2 className="font-bold text-[22px] sm:text-[28px] text-white leading-tight mb-1">{deal.n}</h2>
              <p className="text-zinc-300 text-[14px] sm:text-[15px] mb-3">{deal.p} · {deal.h}</p>
              <div className="flex gap-2 flex-wrap items-center mb-3">
                <PriceBadge pr={deal.pr} large />
                <span className="bg-zinc-800/80 text-zinc-200 text-[12px] px-3 py-1 rounded-full border border-zinc-700">{deal.d}</span>
                <span className="bg-zinc-800/80 text-zinc-200 text-[12px] px-3 py-1 rounded-full border border-zinc-700 flex items-center gap-1">
                  <Clock size={10} />{deal.hr}
                </span>
              </div>
              <p className="text-zinc-300 text-[13px] leading-relaxed line-clamp-2">{deal.desc}</p>
              <div className="flex gap-3 mt-3">
                {deal.sc >= 9 && <span className="text-amber-400 text-[12px] font-bold">★ TOP VALUE</span>}
                {deal.tr >= 9 && <span className="text-pink-400 text-[12px] font-bold">🔥 TRENDING</span>}
                {isTried && <span className="text-amber-400 text-[12px] font-bold flex items-center gap-1"><CheckCircle size={11} />Tried</span>}
                {isSaved && <span className="text-red-400 text-[12px] font-bold">♥ Saved</span>}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ─── Deal Modal ───────────────────────────────────────────────────────────────

function DealModal({ deal, onClose, isSaved, onToggleSave, isTried, onToggleTried }: {
  deal: Deal;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
  isTried: boolean;
  onToggleTried: (slug: string) => void;
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
        className="bg-zinc-900 border border-zinc-700 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderTop: `4px solid ${ci.cl}` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* mobile drag handle */}
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />

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

          <p className="text-zinc-200 text-[14px] leading-relaxed mb-4">{deal.desc}</p>

          <p className="text-zinc-400 text-[13px] flex items-center gap-1.5 mb-5">
            <MapPin size={12} className="text-zinc-500" /> {deal.h}
          </p>

          {(deal.sc >= 9 || deal.tr >= 9) && (
            <div className="flex gap-3 mb-5 pb-4 border-b border-zinc-800">
              {deal.sc >= 9 && <span className="text-amber-400 text-[13px] font-bold">★ TOP VALUE</span>}
              {deal.tr >= 9 && <span className="text-pink-400 text-[13px] font-bold">🔥 TRENDING</span>}
            </div>
          )}

          {/* Tried it button */}
          <button
            onClick={() => onToggleTried(deal.s)}
            className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all mb-2.5 flex items-center justify-center gap-2 ${
              isTried
                ? "bg-amber-500 text-black"
                : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            <CheckCircle size={15} className={isTried ? "" : "opacity-50"} />
            {isTried ? "✓ You tried this!" : "I tried this place"}
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={() => onToggleSave(deal.s)}
              className={`flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                isSaved ? "bg-red-950 text-red-300 border border-red-800" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
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
  const [openNow, setOpenNow] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [view, setView] = useState<"bento" | "map">("bento");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [tried, setTried] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("nyc-saved") ?? "[]");
      setSaved(new Set(s));
      const t = JSON.parse(localStorage.getItem("nyc-tried") ?? "[]");
      setTried(new Set(t));
    } catch {}
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQ(""); searchRef.current?.blur();
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
    if (openNow) params.set("open", "1");
    if (view !== "bento") params.set("view", view);
    const str = params.toString();
    window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
  }, [q, cat, bor, sort, maxPrice, todayOnly, openNow, view]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setQ(params.get("q")!);
    if (params.get("cat")) setCat(params.get("cat")!);
    if (params.get("bor")) setBor(params.get("bor")!);
    if (params.get("sort")) setSort(params.get("sort")!);
    if (params.get("price")) setMaxPrice(params.get("price")!);
    if (params.get("today") === "1") setTodayOnly(true);
    if (params.get("open") === "1") setOpenNow(true);
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

  const toggleTried = useCallback((slug: string) => {
    setTried(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      localStorage.setItem("nyc-tried", JSON.stringify([...next]));
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
  const openCount = useMemo(() => DEALS.filter(d => isDealToday(d) && isOpenNow(d.hr)).length, []);

  const dotd = useMemo(() => getDealOfTheDay(), []);

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
      const mo = !openNow || (isDealToday(d) && isOpenNow(d.hr));
      const ms2 = !savedOnly || saved.has(d.s);
      return ms && mc && mb && mp && mt && mo && ms2;
    });
    if (sort === "price") r.sort((a, b) => extractPrice(a.pr) - extractPrice(b.pr));
    if (sort === "value") r.sort((a, b) => b.sc - a.sc);
    if (sort === "trend") r.sort((a, b) => b.tr - a.tr);
    return r;
  }, [q, cat, bor, sort, maxPrice, todayOnly, openNow, savedOnly, saved]);

  const mappedDeals = useMemo(() =>
    filtered.filter(d => (d.lat !== undefined && d.lng !== undefined) || d.s in DEAL_COORDS),
  [filtered]);

  const hasFilters = q || cat !== "All" || bor !== "All Boroughs" || maxPrice !== "all" || todayOnly || openNow || savedOnly;

  function pickSurprise() {
    const pool = filtered.length > 0 ? filtered : DEALS;
    setSelectedDeal(pool[Math.floor(Math.random() * pool.length)]);
  }

  function clearAll() {
    setQ(""); setCat("All"); setBor("All Boroughs");
    setMaxPrice("all"); setTodayOnly(false); setOpenNow(false); setSavedOnly(false);
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

            {/* Open Now */}
            <button
              onClick={() => { setOpenNow(v => !v); if (!openNow) setTodayOnly(false); }}
              title={`${openCount} deals open right now`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                openNow ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${openNow ? "bg-black" : "bg-emerald-400"} animate-pulse`} />
              <span className="hidden sm:inline">Open Now</span>
              {!openNow && <span className="bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{openCount}</span>}
            </button>

            {/* Today */}
            <button
              onClick={() => { setTodayOnly(v => !v); if (!todayOnly) setOpenNow(false); }}
              title={`${todayCount} deals today`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all ${
                todayOnly ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              <CalendarDays size={13} />
              <span className="hidden sm:inline">{todayOnly ? todayName : "Today"}</span>
              {!todayOnly && <span className="bg-zinc-700 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{todayCount}</span>}
            </button>

            {/* Saved */}
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

            {/* Surprise */}
            <button onClick={pickSurprise} title="Random deal"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-amber-500 hover:text-black transition-all">
              <Shuffle size={14} />
            </button>

            {/* View toggle */}
            <div className="flex bg-zinc-800 rounded-xl p-1 gap-0.5">
              <button onClick={() => setView("bento")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${view === "bento" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200"}`}>
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${view === "map" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200"}`}>
                <MapIcon size={13} />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

          {/* Row 2: Search */}
          <div className="relative mb-2.5">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search deals, restaurants, neighborhoods…"
              className="w-full pl-10 pr-9 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-[14px] text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
            />
            {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"><X size={14} /></button>}
          </div>

          {/* Row 3: Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATS.map(c => (
              <button key={c.k} onClick={() => setCat(c.k)}
                className="flex-shrink-0 flex items-center gap-1 pl-2.5 pr-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all"
                style={{
                  border: cat === c.k ? `1px solid ${c.cl}` : "1px solid #3f3f46",
                  background: cat === c.k ? `${c.cl}22` : "transparent",
                  color: cat === c.k ? c.cl : "#a1a1aa",
                }}
              >
                <span>{c.i}</span><span>{c.l}</span>
                {c.k !== "All" && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full ml-0.5"
                    style={{ background: cat === c.k ? `${c.cl}30` : "#3f3f46", color: cat === c.k ? c.cl : "#71717a" }}>
                    {catCounts[c.k] ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Row 4: Filters */}
          <div className="flex gap-2 items-center pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "Any $", value: "all" },
              { label: "FREE", value: "0" },
              { label: "≤$5", value: "5" },
              { label: "≤$10", value: "10" },
              { label: "≤$15", value: "15" },
            ].map(p => (
              <button key={p.value} onClick={() => setMaxPrice(p.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap ${
                  maxPrice === p.value ? "bg-amber-500 text-black" : "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                }`}>{p.label}</button>
            ))}
            <div className="w-px h-4 bg-zinc-700 flex-shrink-0" />
            <select value={bor} onChange={e => setBor(e.target.value)}
              className="flex-shrink-0 px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none focus:border-amber-500">
              {["All Boroughs","Manhattan","Brooklyn","Queens","Bronx","Staten Island","Citywide"].map(b => <option key={b}>{b}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="flex-shrink-0 px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none focus:border-amber-500">
              <option value="cat">Category</option>
              <option value="price">Price ↑</option>
              <option value="value">Best Value</option>
              <option value="trend">Trending</option>
            </select>
            {hasFilters && (
              <button onClick={clearAll} className="flex-shrink-0 flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white transition-colors px-2">
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
              <select value={cat} onChange={e => setCat(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-[12px] text-zinc-300 cursor-pointer outline-none hover:border-zinc-500">
                {CATS.map(c => <option key={c.k} value={c.k}>{c.i} {c.l}</option>)}
              </select>
            </div>
            <MapView filterCat={cat} />
            <p className="text-[11px] text-zinc-600 text-center mt-2 mb-6">OpenStreetMap · CARTO dark tiles · no API key required</p>
            {mappedDeals.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                  <MapPin size={13} className="text-amber-500" />Deals on the map
                  <span className="font-mono text-zinc-500 font-normal text-[12px]">{mappedDeals.length}</span>
                </p>
                <div className="-mx-4 px-4 flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {mappedDeals.map(d => {
                    const ci = CATS.find(ct => ct.k === d.c) || CATS[0];
                    return (
                      <div key={d.s} onClick={() => setSelectedDeal(d)}
                        className="flex-shrink-0 w-52 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-500 transition-colors cursor-pointer flex flex-col"
                        style={{ borderTop: `2px solid ${ci.cl}` }}>
                        <div className="p-3 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-lg leading-none">{ci.i}</span>
                            <PriceBadge pr={d.pr} />
                          </div>
                          <p className="font-bold text-[13px] text-white line-clamp-2 mb-1 leading-snug">{d.n}</p>
                          <p className="text-[11px] text-zinc-300 truncate mb-1">{d.p}</p>
                          <p className="text-[10px] text-zinc-400 flex items-center gap-1 truncate mb-auto"><MapPin size={8} className="flex-shrink-0" />{d.h}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="bg-zinc-800 text-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-medium">{d.d}</span>
                            {(d.sc >= 9 || d.tr >= 9) && <span className="text-[11px]">{d.sc >= 9 && "★"}{d.tr >= 9 && "🔥"}</span>}
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
            {/* Deal of the Day — only show when no filters active */}
            {!hasFilters && (
              <DealOfTheDayCard
                deal={dotd}
                isSaved={saved.has(dotd.s)}
                isTried={tried.has(dotd.s)}
                onClick={() => setSelectedDeal(dotd)}
              />
            )}

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🍕</div>
                <p className="text-base text-zinc-300 mb-3">No deals match your filters.</p>
                <button onClick={clearAll} className="text-amber-400 text-sm hover:underline">Clear all filters</button>
              </div>
            )}

            {openNow && filtered.length > 0 && (
              <div className="mb-5 px-4 py-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-[14px] text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span><strong>{filtered.length} deals</strong> open right now</span>
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
                      <CategoryHero cat={c} count={group.length} />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {group.map(d => (
                          <DealCard key={d.s} d={d}
                            catColor={c.cl} catEmoji={c.i}
                            isSaved={saved.has(d.s)} isTried={tried.has(d.s)}
                            onClick={() => setSelectedDeal(d)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map(d => {
                  const ci = CATS.find(ct => ct.k === d.c) || CATS[0];
                  return (
                    <DealCard key={d.s} d={d}
                      catColor={ci.cl} catEmoji={ci.i}
                      isSaved={saved.has(d.s)} isTried={tried.has(d.s)}
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
        <p className="text-[12px] text-zinc-600 mb-1">
          Sources: Eater NY · The Infatuation · EatDrinkDeals · MurphGuide · SecretNYC · NY Post
        </p>
        <p className="text-[12px] text-zinc-700 mb-4">Photos: Unsplash</p>
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
          isTried={tried.has(selectedDeal.s)}
          onToggleTried={toggleTried}
        />
      )}
    </div>
  );
}
