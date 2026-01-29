"use client";

import dynamic from "next/dynamic";
// import { useMemo } from "react";

export const MapView = dynamic(
    () => import("./map-view"),
    {
        loading: () => <div className="h-full w-full bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">Loading Map...</div>,
        ssr: false
    }
);
