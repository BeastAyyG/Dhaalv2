"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Report } from "@/lib/types";
import L from "leaflet";

// Severity-based marker colors using SVG data URIs
const createColoredIcon = (color: string) => {
    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="${color}" stroke="#FFFFFF" stroke-width="2" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="white" cx="12" cy="12" r="5"/>
    </svg>
  `;
    return new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
        iconSize: [28, 42], // Slightly larger for touch targets
        iconAnchor: [14, 42],
        popupAnchor: [0, -42],
    });
};

// Pre-create icons for performance (Civic Brutalism Palette)
const redIcon = createColoredIcon("#DC2626");    // High severity (7-10) - Signal Red
const orangeIcon = createColoredIcon("#F59E0B"); // Medium severity (4-6) - Trust Gold
const greenIcon = createColoredIcon("#10B981");  // Low severity (1-3) - Resolution Green

const getIconBySeverity = (severity: number) => {
    if (severity >= 7) return redIcon;
    if (severity >= 4) return orangeIcon;
    return greenIcon;
};

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
    }, [center, map]);
    return null;
}

// Force map resize when visibility changes
function MapInvalidator({ isVisible }: { isVisible?: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (isVisible) {
            setTimeout(() => map.invalidateSize(), 150); // slight delay for animation
        }
        // Always resizing on mount helps too
        map.invalidateSize();
    }, [map, isVisible]);
    return null;
}

interface MapViewProps {
    reports: Report[];
    center: [number, number];
    onMarkerClick?: (report: Report) => void;
    isVisible?: boolean; // New prop
}

export default function MapView({ reports, center, onMarkerClick, isVisible = true }: MapViewProps) {
    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapController center={center} />
                <MapInvalidator isVisible={isVisible} />

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.lat, report.lng]}
                        icon={getIconBySeverity(report.severity)}
                        eventHandlers={{
                            click: () => onMarkerClick?.(report),
                        }}
                    >
                        <Popup>
                            <div className="font-medium">{report.category}</div>
                            <div className="text-xs text-neutral-500">Severity: {report.severity}/10</div>
                            <div className="text-xs text-neutral-400">{report.status}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
