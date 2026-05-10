"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEALS, CATS, type Deal } from "./data";
import { DEAL_COORDS } from "./coordinates";

type MapDeal = Deal & { lat: number; lng: number };

function getCatColor(category: string): string {
  return CATS.find(c => c.k === category)?.cl ?? "#f59e0b";
}

function getCatEmoji(category: string): string {
  return CATS.find(c => c.k === category)?.i ?? "📍";
}

function extractPrice(pr: string): number {
  if (!pr) return 999;
  if (pr.includes("FREE") || pr.includes("BOGO")) return 0;
  const m = pr.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 999;
}

export default function MapView({ filterCat }: { filterCat: string }) {
  // Fix Leaflet default icon path issue in Next.js (not needed since we use CircleMarker)
  useEffect(() => {
    // ensures leaflet CSS vars are resolved
  }, []);

  const deals: MapDeal[] = DEALS.filter(d => {
    const hasCoords =
      (d.lat !== undefined && d.lng !== undefined) || d.s in DEAL_COORDS;
    if (!hasCoords) return false;
    if (filterCat !== "All" && d.c !== filterCat) return false;
    return true;
  }).map(d => {
    if (d.lat !== undefined && d.lng !== undefined) return d as MapDeal;
    const [lat, lng] = DEAL_COORDS[d.s];
    return { ...d, lat, lng };
  });

  return (
    <div className="w-full h-[520px] sm:h-[620px] rounded-xl overflow-hidden border border-zinc-800 relative">
      <MapContainer
        center={[40.735, -73.985]}
        zoom={12}
        style={{ height: "100%", width: "100%", background: "#09090b" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {deals.map(d => {
          const color = getCatColor(d.c);
          const v = extractPrice(d.pr);
          const radius = v === 0 ? 10 : v <= 5 ? 9 : v <= 15 ? 8 : 7;
          return (
            <CircleMarker
              key={d.s}
              center={[d.lat, d.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 1.5,
                opacity: 0.9,
              }}
            >
              <Popup className="nyc-popup">
                <div className="bg-zinc-900 rounded-xl p-3 min-w-[200px] max-w-[240px]">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-base leading-none mt-0.5">{getCatEmoji(d.c)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-zinc-100 leading-snug">{d.n}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{d.p}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center flex-wrap mt-2 mb-2">
                    <span
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{ background: `${color}20`, color, borderColor: `${color}50` }}
                    >
                      {d.pr}
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">{d.d}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">{d.desc}</p>
                  {(d.sc >= 9 || d.tr >= 9) && (
                    <div className="flex gap-2 mt-1.5 text-[10px] font-bold">
                      {d.sc >= 9 && <span className="text-amber-400">★ TOP VALUE</span>}
                      {d.tr >= 9 && <span className="text-pink-400">🔥 TRENDING</span>}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-zinc-950/90 backdrop-blur border border-zinc-800 rounded-xl p-3 pointer-events-none">
        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          {deals.length} mapped
        </p>
        <div className="space-y-1.5">
          {CATS.slice(1)
            .filter(c => deals.some(d => d.c === c.k))
            .slice(0, 9)
            .map(c => (
              <div key={c.k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.cl }} />
                <span className="text-[10px] text-zinc-400">{c.l}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
