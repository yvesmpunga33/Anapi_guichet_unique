"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";

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

  // Calculate scale to fit the map
  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;
  const scaleX = (svgWidth - padding * 2) / lonRange;
  const scaleY = (svgHeight - padding * 2) / latRange;
  const scale = Math.min(scaleX, scaleY);

  // Center the map
  const offsetX = (svgWidth - lonRange * scale) / 2;
  const offsetY = (svgHeight - latRange * scale) / 2;

  const projectPoint = ([lon, lat]) => {
    const x = (lon - minLon) * scale + offsetX;
    const y = (maxLat - lat) * scale + offsetY; // Flip Y axis (lat increases upward)
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

  // Add small padding
  const lonPad = (maxLon - minLon) * 0.02;
  const latPad = (maxLat - minLat) * 0.02;

  return {
    minLon: minLon - lonPad,
    maxLon: maxLon + lonPad,
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
  };
}

const DRCMapComponent = ({
  provinces = [],
  onProvinceClick,
  selectedProvinceId,
  className = "",
}) => {
  const [geoData, setGeoData] = useState(null);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 600;

  // Load GeoJSON data
  useEffect(() => {
    setLoading(true);
    fetch("/data/drc-provinces-simple.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load map data");
        return res.json();
      })
      .then((data) => {
        console.log("GeoJSON loaded:", data.features?.length, "features");
        if (data.features) {
          data.features.forEach(f => console.log("-", f.properties?.name));
        }
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading map data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Calculate bounds from GeoJSON
  const bounds = useMemo(() => {
    if (!geoData?.features) return null;
    return calculateBounds(geoData.features);
  }, [geoData]);

  // Create a map of province data by normalized name
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
    if (!data) return "#E2E8F0"; // Gris clair pour provinces sans données

    const count = data.opportunitiesCount || 0;
    if (count === 0) return "#E2E8F0";      // Gris clair
    if (count <= 2) return "#86EFAC";       // Vert clair
    if (count <= 5) return "#FBBF24";       // Jaune/Or (ANAPI gold)
    if (count <= 10) return "#F97316";      // Orange
    return "#DC2626";                        // Rouge pour 10+
  }, [getProvinceData]);

  const isSelected = useCallback((feature) => {
    const data = getProvinceData(feature);
    return data && data.id === selectedProvinceId;
  }, [getProvinceData, selectedProvinceId]);

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

  const handleClick = useCallback((feature) => {
    const name = feature.properties?.name;
    if (!name) return;

    const data = getProvinceData(feature);
    const clickData = data || {
      id: getProvinceKey(name),
      name: name,
      code: feature.properties?.code,
      opportunitiesCount: 0,
    };
    onProvinceClick?.(clickData);
  }, [getProvinceData, getProvinceKey, onProvinceClick]);

  const hoveredProvinceData = useMemo(() => {
    if (!hoveredProvince) return null;
    const key = getProvinceKey(hoveredProvince);
    return provinceDataMap[key] || null;
  }, [hoveredProvince, getProvinceKey, provinceDataMap]);

  // Generate paths from GeoJSON
  const paths = useMemo(() => {
    if (!geoData?.features || !bounds) return [];
    return geoData.features.map((feature, index) => ({
      id: feature.properties?.name || `province-${index}`,
      name: feature.properties?.name || "Unknown",
      path: geoToPath(feature.geometry, bounds, svgWidth, svgHeight),
      feature,
    }));
  }, [geoData, bounds, svgWidth, svgHeight]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500">Erreur: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-blue-500 underline">
            Recharger
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: ANAPI_COLORS.gold, borderTopColor: "transparent" }}
          ></div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Map Title */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          République Démocratique du Congo
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {paths.length} Provinces - Cliquez sur une province
        </p>
      </div>

      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {paths.map(({ id, name, path, feature }) => {
            const isHovered = hoveredProvince === name;
            const selected = isSelected(feature);
            const fillColor = getProvinceColor(feature);

            return (
              <path
                key={id}
                d={path}
                fill={fillColor}
                stroke={selected || isHovered ? ANAPI_COLORS.gold : "#64748B"}
                strokeWidth={selected ? 2 : isHovered ? 1.5 : 0.5}
                style={{
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  filter: isHovered ? "brightness(1.1)" : "none",
                }}
                onMouseEnter={(evt) => handleMouseEnter(feature, evt)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(feature)}
              >
                <title>{name}</title>
              </path>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip */}
      {hoveredProvince && (
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border-l-4 z-50 min-w-[200px] max-w-[280px] pointer-events-none"
          style={{
            borderLeftColor: ANAPI_COLORS.gold,
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y - 10}px`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-4 h-4 rounded-md flex-shrink-0"
              style={{ backgroundColor: hoveredProvinceData ? "#3B82F6" : "#CBD5E1" }}
            />
            <h4 className="font-bold text-gray-900 dark:text-white text-base">{hoveredProvince}</h4>
          </div>

          {hoveredProvinceData ? (
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                <span>Opportunités</span>
                <span className="font-bold text-lg" style={{ color: ANAPI_COLORS.gold }}>
                  {hoveredProvinceData.opportunitiesCount || 0}
                </span>
              </div>
              {hoveredProvinceData.totalMinInvestment > 0 && (
                <div className="flex justify-between items-center">
                  <span>Invest. requis</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(hoveredProvinceData.totalMinInvestment / 1000000).toFixed(1)}M
                  </span>
                </div>
              )}
              {hoveredProvinceData.totalExpectedJobs > 0 && (
                <div className="flex justify-between items-center">
                  <span>Emplois prévus</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {hoveredProvinceData.totalExpectedJobs.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucune opportunité active</p>
          )}
          <p className="text-xs text-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700" style={{ color: ANAPI_COLORS.mediumBlue }}>
            Cliquez pour voir les détails →
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ANAPI_COLORS.gold }} />
          Opportunités
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
                className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DRCMap = memo(DRCMapComponent);

export default DRCMap;
