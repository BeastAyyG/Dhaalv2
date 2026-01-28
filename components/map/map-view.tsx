"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Report } from "@/lib/types";
import L from "leaflet";

// Fix for default Leaflet markers in Next.js
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
    }, [center, map]);
    return null;
}

interface MapViewProps {
    reports: Report[];
    center: [number, number];
    onMarkerClick?: (report: Report) => void;
}

export default function MapView({ reports, center, onMarkerClick }: MapViewProps) {
    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={center} />

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.lat, report.lng]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => onMarkerClick?.(report),
                        }}
                    >
                        <Popup>
                            <div className="text-sm font-medium">{report.category}</div>
                            <div className="text-xs text-neutral-500">{report.status}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
