"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Shop } from "@/components/StoreMap";

const StoreMap = dynamic(() => import("@/components/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl bg-navy-400/20 flex items-center justify-center">
      <p className="text-navy-300">Loading map...</p>
    </div>
  ),
});

// Default: Kanpur Mall Road area — our launch city
const KANPUR_CENTER = { lat: 26.4499, lng: 80.3319 };

// Haversine distance in km
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function fetchMobileShops(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Shop[]> {
  // Overpass QL: find nodes/ways tagged as mobile-phone shops within radius
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="mobile_phone"](around:${radiusMeters},${lat},${lng});
      way["shop"="mobile_phone"](around:${radiusMeters},${lat},${lng});
      node["shop"="mobile"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `.trim();

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: query,
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();
  const elements: OverpassElement[] = data.elements || [];

  return elements
    .map((el) => {
      const eLat = el.lat ?? el.center?.lat;
      const eLng = el.lon ?? el.center?.lon;
      if (eLat == null || eLng == null) return null;
      const tags = el.tags || {};
      const addressParts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:suburb"] || tags["addr:neighbourhood"],
        tags["addr:city"],
        tags["addr:postcode"],
      ].filter(Boolean);
      const shop: Shop = {
        id: String(el.id),
        name: tags.name || tags["name:en"] || "Mobile Shop",
        lat: eLat,
        lng: eLng,
        address: addressParts.length > 0 ? addressParts.join(", ") : undefined,
        phone: tags.phone || tags["contact:phone"],
        distanceKm: distanceKm({ lat, lng }, { lat: eLat, lng: eLng }),
      };
      return shop;
    })
    .filter((s): s is Shop => s !== null)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

async function geocode(query: string): Promise<{ lat: number; lng: number; label: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data[0]) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    label: data[0].display_name,
  };
}

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [center, setCenter] = useState(KANPUR_CENTER);
  const [locationLabel, setLocationLabel] = useState("Kanpur, Uttar Pradesh");
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShops = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMobileShops(lat, lng, 5000);
      setShops(results);
      setSelectedShopId(null);
    } catch {
      setError("Couldn't load shops. The map service may be busy — try again in a moment.");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — Kanpur
  useEffect(() => {
    loadShops(KANPUR_CENTER.lat, KANPUR_CENTER.lng);
  }, [loadShops]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    const query = searchQuery.includes(",") || searchQuery.toLowerCase().includes("india")
      ? searchQuery
      : `${searchQuery}, India`;
    const located = await geocode(query);
    if (!located) {
      setError(`Couldn't find "${searchQuery}". Try a city or pincode.`);
      setLoading(false);
      return;
    }
    const newCenter = { lat: located.lat, lng: located.lng };
    setCenter(newCenter);
    setLocationLabel(located.label.split(",").slice(0, 3).join(","));
    await loadShops(newCenter.lat, newCenter.lng);
  };

  const handleUseLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not available in this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCenter = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(newCenter);
        setUserLocation(newCenter);
        setLocationLabel("Your current location");
        await loadShops(newCenter.lat, newCenter.lng);
      },
      () => {
        setError("Couldn't get your location. Please allow location access or search by city.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedShop = useMemo(
    () => shops.find((s) => s.id === selectedShopId) || null,
    [shops, selectedShopId]
  );

  return (
    <>
      <Navbar />
      <main className="bg-[#050B17] min-h-screen">
        {/* Hero */}
        <section className="pt-36 pb-12 text-center px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 60%)" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold-400" />
              </span>
              <span className="text-gold-400 text-[10px] font-medium tracking-widest uppercase">
                Partner network launching soon
              </span>
            </div>
            <h1 className="font-display text-white text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.95] max-w-5xl mx-auto mb-6">
              Find shops<br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
                near you.
              </span>
            </h1>
            <p className="text-white/55 text-sm sm:text-base max-w-xl mx-auto">
              While we build our Credit Speed retailer network, discover mobile shops across India — powered by OpenStreetMap.
            </p>
          </motion.div>
        </section>

        {/* Search bar */}
        <section className="px-6 pb-8">
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 py-2">
              <svg className="w-5 h-5 text-navy-300 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter city, area, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none bg-transparent text-navy-500 placeholder:text-navy-300"
              />
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-navy-50 hover:bg-navy-100 rounded-xl text-navy-500 text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Use My Location
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-navy-500 px-8 py-3 rounded-xl font-semibold transition"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-2 text-xs text-white/45"
          >
            <svg className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
            </svg>
            Showing results near: <span className="text-gold-400 font-medium">{locationLabel}</span>
          </motion.div>
        </section>

        {/* Map + list */}
        <section className="px-6 lg:px-12 py-10 mt-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-3 h-[600px] relative"
              >
                <StoreMap
                  shops={shops}
                  center={center}
                  zoom={13}
                  selectedShopId={selectedShopId}
                  onSelectShop={setSelectedShopId}
                  userLocation={userLocation}
                />
                {loading && (
                  <div className="absolute inset-0 bg-navy-500/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-[1000]">
                    <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg">
                      <svg className="animate-spin w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span className="text-navy-500 text-sm font-medium">Loading shops...</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display text-white text-2xl tracking-tight">
                    {shops.length} Shop{shops.length !== 1 ? "s" : ""} Found
                  </h2>
                  <span className="text-white/40 text-[10px] font-medium tracking-widest uppercase">By distance</span>
                </div>

                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {error && (
                    <div className="glass rounded-2xl p-4 border-red-400/30">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {!loading && shops.length === 0 && !error && (
                    <div className="glass rounded-2xl p-6 text-center">
                      <p className="text-white/45 text-sm">
                        No mobile shops found in this area on OpenStreetMap. Try a different city or zoom out.
                      </p>
                    </div>
                  )}

                  {shops.map((shop, i) => {
                    const isSelected = shop.id === selectedShopId;
                    return (
                      <motion.div
                        key={shop.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
                        onClick={() => setSelectedShopId(shop.id)}
                        className={`rounded-2xl p-5 cursor-pointer transition ${
                          isSelected
                            ? "glass-strong border-gold-400/40 shadow-lg shadow-gold-400/10"
                            : "glass hover:border-gold-400/25"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-display text-white text-base tracking-tight">
                                {shop.name}
                              </h3>
                              {isSelected && (
                                <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest">
                                  Selected
                                </span>
                              )}
                            </div>
                            {shop.address && (
                              <p className="text-white/45 text-xs leading-relaxed">
                                {shop.address}
                              </p>
                            )}
                          </div>
                          {shop.distanceKm !== undefined && (
                            <span className="text-gold-400 text-sm font-semibold whitespace-nowrap tabular-nums">
                              {shop.distanceKm.toFixed(1)} km
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white py-2 rounded-lg text-xs font-semibold transition"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Directions
                          </a>
                          {shop.phone ? (
                            <a
                              href={`tel:${shop.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center gap-1.5 bg-gold-400 hover:bg-gold-200 text-navy-500 py-2 rounded-lg text-xs font-semibold transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2l2 5-3 2a11 11 0 006 6l2-3 5 2v2a2 2 0 01-2 2A16 16 0 013 5z" />
                              </svg>
                              Call Shop
                            </a>
                          ) : (
                            <button
                              disabled
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center gap-1.5 bg-white/3 text-white/30 py-2 rounded-lg text-xs font-semibold cursor-not-allowed"
                            >
                              No phone
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mt-10 glass-strong rounded-3xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 60%)" }}
              />
              <h3 className="font-display text-white text-2xl sm:text-3xl tracking-tight mb-3 relative">
                Own a mobile shop?
              </h3>
              <p className="text-white/45 text-sm mb-6 max-w-md mx-auto relative">
                Be one of the first Credit Speed partner retailers in your city.
              </p>
              <a
                href="/partner"
                className="relative inline-block bg-white hover:bg-gold-200 text-navy-500 px-8 py-3 rounded-full font-semibold text-sm transition"
              >
                Become a Partner Retailer
              </a>
            </motion.div>

            <p className="text-center text-white/30 text-xs mt-6">
              Shop data from{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gold-400"
              >
                OpenStreetMap
              </a>{" "}
              contributors. Listings may be incomplete.
              {selectedShop?.name ? ` • Viewing: ${selectedShop.name}` : ""}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
