"use client";

import { useState, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl, Layer, type LayerProps } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DEALS, CATS, type Deal } from "./data";
import { DEAL_COORDS } from "./coordinates";
import { MapPin, X } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const BUILDING_LAYER: LayerProps = {
  id: "3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 13,
  paint: {
    "fill-extrusion-color": "#1e293b",
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "min_height"],
    "fill-extrusion-opacity": 0.85,
  } as Record<string, unknown>,
};

type MapDeal = Deal & { lat: number; lng: number };

function getColor(category: string): string {
  const cat = CATS.find(c => c.k === category);
  return cat?.cl ?? "#f59e0b";
}

export default function MapView({ filterCat }: { filterCat: string }) {
  const [viewState, setViewState] = useState({
    longitude: -73.9851,
    latitude: 40.7450,
    zoom: 12.5,
    pitch: 55,
    bearing: -18,
  });
  const [popup, setPopup] = useState<MapDeal | null>(null);

  // Merge DEAL_COORDS with DEALS + inline coords
  const mappedDeals: MapDeal[] = DEALS.filter(d => {
    const hasCoordsInline = d.lat !== undefined && d.lng !== undefined;
    const hasCoordsLookup = d.s in DEAL_COORDS;
    if (!hasCoordsInline && !hasCoordsLookup) return false;
    if (filterCat !== "All" && d.c !== filterCat) return false;
    return true;
  }).map(d => {
    if (d.lat !== undefined && d.lng !== undefined) {
      return d as MapDeal;
    }
    const [lat, lng] = DEAL_COORDS[d.s];
    return { ...d, lat, lng };
  });

  const handleMarkerClick = useCallback((deal: MapDeal) => {
    setPopup(deal);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[500px] sm:h-[640px] bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-4 text-center px-6">
        <MapPin size={40} className="text-zinc-600" />
        <div>
          <p className="text-zinc-300 font-semibold text-base mb-1">Mapbox token required for 3D map</p>
          <p className="text-zinc-500 text-sm max-w-md">
            Add <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-400 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your Vercel environment variables.
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            Get a free token at <span className="text-amber-500">mapbox.com</span>
          </p>
        </div>
        <div className="mt-2 bg-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-400 font-mono text-left">
          vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] sm:h-[640px] rounded-xl overflow-hidden border border-zinc-800">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        antialias={true}
      >
        <NavigationControl position="top-right" style={{ background: "#18181b", borderColor: "#3f3f46" }} />
        <Layer {...BUILDING_LAYER} />

        {mappedDeals.map(deal => {
          const color = getColor(deal.c);
          return (
            <Marker
              key={deal.s}
              longitude={deal.lng}
              latitude={deal.lat}
              anchor="bottom"
              onClick={e => { e.originalEvent.stopPropagation(); handleMarkerClick(deal); }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform border-2 text-sm select-none"
                style={{ background: `${color}22`, borderColor: color }}
                title={deal.n}
              >
                {CATS.find(c => c.k === deal.c)?.i ?? "📍"}
              </div>
            </Marker>
          );
        })}

        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            closeButton={false}
            offset={36}
            style={{ padding: 0 }}
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 max-w-[240px] shadow-2xl">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-zinc-100 font-semibold text-[13px] leading-snug">{popup.n}</p>
                <button onClick={() => setPopup(null)} className="text-zinc-500 hover:text-zinc-300 flex-shrink-0 mt-0.5">
                  <X size={12} />
                </button>
              </div>
              <p className="text-zinc-500 text-[11px] mb-1.5">{popup.p}</p>
              <div className="flex gap-1.5 items-center flex-wrap mb-2">
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${getColor(popup.c)}22`, color: getColor(popup.c), border: `1px solid ${getColor(popup.c)}44` }}
                >
                  {popup.pr}
                </span>
                <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded-full">{popup.d}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3">{popup.desc}</p>
              {(popup.sc >= 9 || popup.tr >= 9) && (
                <div className="flex gap-2 mt-2 text-[10px] font-bold">
                  {popup.sc >= 9 && <span className="text-amber-400">★ TOP VALUE</span>}
                  {popup.tr >= 9 && <span className="text-pink-400">🔥 TRENDING</span>}
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-3 max-w-[160px]">
        <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
          {mappedDeals.length} mapped deals
        </p>
        <div className="space-y-1.5">
          {CATS.slice(1)
            .filter(c => mappedDeals.some(d => d.c === c.k))
            .slice(0, 8)
            .map(c => (
              <div key={c.k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.cl }} />
                <span className="text-[10px] text-zinc-400 leading-none">{c.l}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
