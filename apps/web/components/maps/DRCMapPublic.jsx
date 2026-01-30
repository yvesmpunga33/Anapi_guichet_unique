"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";
import { MapPin, TrendingUp, Users, ArrowRight, Building } from "lucide-react";

// Get API base URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';
  }
  return 'http://localhost:3502';
};

// ANAPI Colors
const ANAPI_COLORS = {
  darkBlue: "#0A1628",
  mediumBlue: "#1E3A5F",
  gold: "#D4A853",
};

// Province name normalization map
const PROVINCE_NAME_MAP = {
  "Kinshasa": "kinshasa",
  "Kongo-Central": "kongo-central",
  "Kongo Central": "kongo-central",
  "Kwango": "kwango",
  "Kwilu": "kwilu",
  "Mai-Ndombe": "mai-ndombe",
  "Équateur": "equateur",
  "Equateur": "equateur",
  "Mongala": "mongala",
  "Nord-Ubangi": "nord-ubangi",
  "Sud-Ubangi": "sud-ubangi",
  "Tshuapa": "tshuapa",
  "Tshopo": "tshopo",
  "Bas-Uele": "bas-uele",
  "Bas-Uélé": "bas-uele",
  "Haut-Uele": "haut-uele",
  "Haut-Uélé": "haut-uele",
  "Ituri": "ituri",
  "Nord-Kivu": "nord-kivu",
  "Sud-Kivu": "sud-kivu",
  "Maniema": "maniema",
  "Sankuru": "sankuru",
  "Kasaï": "kasai",
  "Kasai": "kasai",
  "Kasaï-Central": "kasai-central",
  "Kasai-Central": "kasai-central",
  "Kasaï-Oriental": "kasai-oriental",
  "Kasai-Oriental": "kasai-oriental",
  "Lomami": "lomami",
  "Haut-Lomami": "haut-lomami",
  "Tanganyika": "tanganyika",
  "Haut-Katanga": "haut-katanga",
  "Lualaba": "lualaba",
};

// Convert GeoJSON coordinates to SVG path with simple equirectangular projection
function geoToPath(geometry, bounds, svgWidth, svgHeight) {
  const { minLon, maxLon, minLat, maxLat } = bounds;
  const padding = 40;

  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;
  const scaleX = (svgWidth - padding * 2) / lonRange;
  const scaleY = (svgHeight - padding * 2) / latRange;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (svgWidth - lonRange * scale) / 2;
  const offsetY = (svgHeight - latRange * scale) / 2;

  const projectPoint = ([lon, lat]) => {
    const x = (lon - minLon) * scale + offsetX;
    const y = (maxLat - lat) * scale + offsetY;
    return [x, y];
  };

  const ringToPath = (ring) => {
    if (!ring || ring.length === 0) return "";
    const points = ring.map(projectPoint);
    return "M" + points.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
  };

  if (geometry.type === "Polygon") {
    return geometry.coordinates.map(ringToPath).join(" ");
  } else if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map(polygon =>
      polygon.map(ringToPath).join(" ")
    ).join(" ");
  }
  return "";
}

// Calculate bounding box from GeoJSON
function calculateBounds(features) {
  let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;

  const processCoords = (coords) => {
    if (typeof coords[0] === "number") {
      minLon = Math.min(minLon, coords[0]);
      maxLon = Math.max(maxLon, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      coords.forEach(processCoords);
    }
  };

  features.forEach(f => processCoords(f.geometry.coordinates));

  const lonPad = (maxLon - minLon) * 0.02;
  const latPad = (maxLat - minLat) * 0.02;

  return {
    minLon: minLon - lonPad,
    maxLon: maxLon + lonPad,
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
  };
}

// Format currency
const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

const DRCMapPublicComponent = ({ className = "" }) => {
  const [geoData, setGeoData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const svgWidth = 800;
  const svgHeight = 600;

  // Load GeoJSON and provinces data
  useEffect(() => {
    const apiBaseUrl = getApiBaseUrl();

    const loadData = async () => {
      try {
        // Load GeoJSON first
        const geoRes = await fetch("/data/drc-provinces-simple.json");
        if (!geoRes.ok) {
          console.error("Failed to load GeoJSON:", geoRes.status);
        }
        const geoJson = await geoRes.json();
        setGeoData(geoJson);

        // Load provinces from API
        try {
          const provRes = await fetch(`${apiBaseUrl}/api/v1/geography/public/provinces`);
          if (provRes.ok) {
            const provincesData = await provRes.json();
            setProvinces(provincesData.provinces || []);
            setStats(provincesData.stats || null);
          }
        } catch (apiErr) {
          console.warn("Could not load provinces from API:", apiErr.message);
        }
      } catch (err) {
        console.error("Error loading map data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const bounds = useMemo(() => {
    if (!geoData?.features) return null;
    return calculateBounds(geoData.features);
  }, [geoData]);

  const provinceDataMap = useMemo(() => {
    const map = {};
    provinces.forEach((p) => {
      const normalizedName = Object.entries(PROVINCE_NAME_MAP).find(
        ([key]) => key.toLowerCase() === (p.name || "").toLowerCase()
      );
      if (normalizedName) {
        map[normalizedName[1]] = p;
      }
      const directMatch = (p.name || "").toLowerCase().replace(/[^a-z]/g, "");
      map[directMatch] = p;
    });
    return map;
  }, [provinces]);

  const getProvinceKey = useCallback((geoName) => {
    if (!geoName) return "";
    const normalized = PROVINCE_NAME_MAP[geoName];
    if (normalized) return normalized;
    return geoName.toLowerCase().replace(/[^a-z]/g, "");
  }, []);

  const getProvinceData = useCallback((feature) => {
    const name = feature.properties?.name;
    if (!name) return null;
    const key = getProvinceKey(name);
    return provinceDataMap[key] || null;
  }, [getProvinceKey, provinceDataMap]);

  const getProvinceColor = useCallback((feature) => {
    const data = getProvinceData(feature);
    if (!data) return "#E2E8F0";

    const count = data.opportunitiesCount || 0;
    if (count === 0) return "#E2E8F0";
    if (count <= 2) return "#86EFAC";
    if (count <= 5) return "#FBBF24";
    if (count <= 10) return "#F97316";
    return "#DC2626";
  }, [getProvinceData]);

  const handleMouseEnter = useCallback((feature, evt) => {
    const name = feature.properties?.name;
    if (name) {
      setHoveredProvince(name);
      setTooltipPosition({ x: evt.clientX, y: evt.clientY });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredProvince(null);
  }, []);

  const handleMouseMove = useCallback((evt) => {
    if (hoveredProvince) {
      setTooltipPosition({ x: evt.clientX, y: evt.clientY });
    }
  }, [hoveredProvince]);

  const hoveredProvinceData = useMemo(() => {
    if (!hoveredProvince) return null;
    const key = getProvinceKey(hoveredProvince);
    return provinceDataMap[key] || null;
  }, [hoveredProvince, getProvinceKey, provinceDataMap]);

  const paths = useMemo(() => {
    if (!geoData?.features || !bounds) return [];
    return geoData.features.map((feature, index) => ({
      id: feature.properties?.name || `province-${index}`,
      name: feature.properties?.name || "Unknown",
      path: geoToPath(feature.geometry, bounds, svgWidth, svgHeight),
      feature,
    }));
  }, [geoData, bounds, svgWidth, svgHeight]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-[#0A1628] rounded-2xl ${className}`}>
        <div className="text-center py-20">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: ANAPI_COLORS.gold, borderTopColor: "transparent" }}
          ></div>
          <p className="mt-4 text-gray-400">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Map */}
        <div className="lg:col-span-8">
          <div
            className="relative bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            {/* Map Title */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
              <h3 className="text-lg font-bold text-white">
                Republique Democratique du Congo
              </h3>
              <p className="text-sm text-gray-400">
                {paths.length} Provinces - Cliquez pour decouvrir les opportunites
              </p>
            </div>

            {/* SVG Map */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full"
              style={{ minHeight: "450px" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <g>
                {paths.map(({ id, name, path, feature }) => {
                  const isHovered = hoveredProvince === name;
                  const fillColor = getProvinceColor(feature);
                  const data = getProvinceData(feature);

                  return (
                    <Link
                      key={id}
                      href={data?.id ? `/investir/provinces/${data.id}` : "#"}
                    >
                      <path
                        d={path}
                        fill={fillColor}
                        stroke={isHovered ? ANAPI_COLORS.gold : "#64748B"}
                        strokeWidth={isHovered ? 2 : 0.5}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          filter: isHovered ? "brightness(1.2)" : "none",
                        }}
                        onMouseEnter={(evt) => handleMouseEnter(feature, evt)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <title>{name}</title>
                      </path>
                    </Link>
                  );
                })}
              </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ANAPI_COLORS.gold }} />
                Opportunites
              </h4>
              <div className="space-y-1">
                {[
                  { color: "#E2E8F0", label: "0" },
                  { color: "#86EFAC", label: "1-2" },
                  { color: "#FBBF24", label: "3-5" },
                  { color: "#F97316", label: "6-10" },
                  { color: "#DC2626", label: "10+" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Tooltip */}
            {hoveredProvince && (
              <div
                className="fixed bg-white rounded-xl shadow-2xl p-4 border-l-4 z-50 min-w-[220px] max-w-[300px] pointer-events-none"
                style={{
                  borderLeftColor: ANAPI_COLORS.gold,
                  left: `${tooltipPosition.x + 15}px`,
                  top: `${tooltipPosition.y - 10}px`,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-[#D4A853]" />
                  <h4 className="font-bold text-gray-900 text-base">{hoveredProvince}</h4>
                </div>

                {hoveredProvinceData ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Opportunites</span>
                      <span className="font-bold text-lg" style={{ color: ANAPI_COLORS.gold }}>
                        {hoveredProvinceData.opportunitiesCount || 0}
                      </span>
                    </div>
                    {hoveredProvinceData.totalMinInvestment > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Invest. min.</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(hoveredProvinceData.totalMinInvestment)}
                        </span>
                      </div>
                    )}
                    {hoveredProvinceData.totalExpectedJobs > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Emplois prevus</span>
                        <span className="font-semibold text-gray-900">
                          {hoveredProvinceData.totalExpectedJobs.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-center mt-3 pt-2 border-t border-gray-100" style={{ color: ANAPI_COLORS.mediumBlue }}>
                      Cliquez pour voir les opportunites
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune opportunite disponible</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Global Stats */}
          {stats && (
            <div className="bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D4A853]" />
                Vue d'ensemble
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1E3A5F]/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-[#D4A853]">{stats.totalOpportunities}</p>
                  <p className="text-sm text-gray-400">Opportunites</p>
                </div>
                <div className="bg-[#1E3A5F]/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">{stats.totalProvinces}</p>
                  <p className="text-sm text-gray-400">Provinces</p>
                </div>
                <div className="bg-[#1E3A5F]/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalInvestment)}</p>
                  <p className="text-sm text-gray-400">Invest. requis</p>
                </div>
                <div className="bg-[#1E3A5F]/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalJobs?.toLocaleString() || 0}</p>
                  <p className="text-sm text-gray-400">Emplois prevus</p>
                </div>
              </div>
            </div>
          )}

          {/* Top Provinces */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-[#0A1628] mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#D4A853]" />
              Provinces en vedette
            </h3>
            <div className="space-y-3">
              {provinces
                .filter(p => p.opportunitiesCount > 0)
                .sort((a, b) => b.opportunitiesCount - a.opportunitiesCount)
                .slice(0, 5)
                .map((province) => (
                  <Link
                    key={province.id}
                    href={`/investir/provinces/${province.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-[#0A1628] group-hover:text-[#D4A853] transition-colors">
                        {province.name}
                      </p>
                      <p className="text-sm text-gray-500">{province.capital}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#D4A853]">{province.opportunitiesCount}</p>
                      <p className="text-xs text-gray-500">opportunites</p>
                    </div>
                  </Link>
                ))}
            </div>

            <Link
              href="/investir"
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] text-white font-semibold rounded-xl hover:from-[#1E3A5F] hover:to-[#0A1628] transition-all group"
            >
              Voir toutes les opportunites
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DRCMapPublic = memo(DRCMapPublicComponent);

export default DRCMapPublic;
