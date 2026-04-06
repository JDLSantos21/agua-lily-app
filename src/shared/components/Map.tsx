"use client";

import { type ReactNode } from "react";
import { divIcon, type LatLngExpression, point } from "leaflet";
import { MapContainer, Marker, TileLayer, Circle, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { renderToString } from "react-dom/server";
import "leaflet/dist/leaflet.css";

// ─── Default coordinates (Santo Domingo, DR) ────────────────────────
const DEFAULT_CENTER: [number, number] = [18.5351492, -69.9074055];
const DEFAULT_ZOOM = 13;

// ─── Custom icon factory ─────────────────────────────────────────────
/**
 * Creates a Leaflet `divIcon` with a Lucide-style icon inside a colored circle,
 * with an optional text label underneath.
 *
 * @param IconComponent - A Lucide (or compatible) icon component
 * @param color         - Background color of the circle (CSS color string)
 * @param label         - Optional text label shown below the icon
 */
export function createCustomIcon(
  IconComponent: React.ComponentType<{ size?: number; color?: string }>,
  color: string,
  label?: string,
  borderColor?: string,
) {
  return divIcon({
    html: renderToString(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            backgroundColor: color,
            borderRadius: "50%",
            border: `2.5px solid ${borderColor ?? "white"}`,
            boxShadow: borderColor
              ? `0 0 0 2px white, 0 2px 8px rgba(0,0,0,0.15)`
              : "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <IconComponent size={18} color="white" />
        </div>
        {label && (
          <div
            style={{
              backgroundColor: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "500",
              color: "#374151",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        )}
      </div>,
    ),
    className: "",
    iconSize: label ? [120, 60] : [32, 32],
    iconAnchor: label ? [60, 32] : [16, 16],
  });
}

// ─── Cluster icon factory ────────────────────────────────────────────
/**
 * Creates a styled cluster icon with a bold count number.
 * Used internally when `enableClustering` is true, but can be
 * overridden via `clusterIconFactory` prop.
 */
export function createClusterCustomIcon(cluster: {
  getChildCount: () => number;
}) {
  const count = cluster.getChildCount();

  // Size tiers based on cluster density
  let size = 40;
  let fontSize = 14;
  if (count >= 100) {
    size = 56;
    fontSize = 18;
  } else if (count >= 10) {
    size = 48;
    fontSize = 16;
  }

  return divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:${size}px;height:${size}px;
      background:linear-gradient(135deg,#64748b,#475569);
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 2px 10px rgba(71,85,105,0.35);
      color:white;
      font-weight:700;
      font-size:${fontSize}px;
      font-family:system-ui,sans-serif;
    ">${count}</div>`,
    className: "",
    iconSize: point(size, size),
    iconAnchor: point(size / 2, size / 2),
  });
}

// ─── LeafletMap props ────────────────────────────────────────────────
export interface LeafletMapProps {
  /** Map center coordinates – defaults to Santo Domingo */
  center?: LatLngExpression;
  /** Initial zoom level */
  zoom?: number;
  /** CSS height of the map container */
  height?: string;
  /**
   * When `true`, markers rendered as children are wrapped in a
   * `MarkerClusterGroup` so dense clusters show a count badge
   * and expand on zoom-in.
   */
  enableClustering?: boolean;
  /**
   * Pixel radius within which markers are grouped into a cluster.
   * Lower values = less aggressive clustering (default: 60).
   */
  maxClusterRadius?: number;
  /** Markers, Circles, Popups, etc. to render inside the map */
  children?: ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────
export default function LeafletMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = "500px",
  enableClustering = false,
  maxClusterRadius = 60,
  children,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        height,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {enableClustering ? (
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={maxClusterRadius}
          iconCreateFunction={createClusterCustomIcon}
        >
          {children}
        </MarkerClusterGroup>
      ) : (
        children
      )}
    </MapContainer>
  );
}

// Re-export react-leaflet primitives for consumer convenience
export { Marker, Circle, Popup, TileLayer };
