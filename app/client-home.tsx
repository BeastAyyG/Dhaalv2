"use client";

import { useState } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Plus, Map as MapIcon, List, User } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Default Center (Bangalore) - In real app, calculate from reports or user loc
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">

      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-20 shrink-0">
        <h1 className="font-bold text-xl tracking-tight">Dhaal 🛡️</h1>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
            1,250 XP
          </div>
          <button className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative h-full md:grid md:grid-cols-2">

        {/* Left: Map (Always visible on Desktop, toggled on Mobile) */}
        <div className={cn(
          "h-full w-full relative",
          viewMode === "feed" ? "hidden md:block" : "block"
        )}>
          <MapView reports={reports} center={defaultCenter} />

          {/* Mobile Floating Toggle */}
          <button
            onClick={() => setViewMode("feed")}
            className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full shadow-lg font-medium z-[1000] flex items-center gap-2"
          >
            <List className="w-4 h-4" /> Show List
          </button>
        </div>

        {/* Right: Feed (Always visible on Desktop, toggled on Mobile) */}
        <div className={cn(
          "h-full w-full bg-neutral-50 dark:bg-neutral-950 overflow-y-auto",
          viewMode === "map" ? "hidden md:block" : "block"
        )}>
          <div className="p-4 space-y-4 pb-24 md:pb-4">
            <div className="hidden md:flex items-center justify-between mb-6">
              <h1 className="font-bold text-2xl">Community Reports</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Bangalore, IN</span>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-10 text-neutral-500">
                <p>No reports yet. Be the first!</p>
              </div>
            ) : (
              reports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </div>

          {/* Mobile Floating Toggle for Map */}
          <button
            onClick={() => setViewMode("map")}
            className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full shadow-lg font-medium z-10 flex items-center gap-2"
          >
            <MapIcon className="w-4 h-4" /> Show Map
          </button>
        </div>

      </div>

      {/* Floating Action Button (New Report) */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-black dark:bg-white text-white dark:text-black w-14 h-14 rounded-full shadow-xl shadow-black/20 flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around z-20 shrink-0">
        <button className="flex flex-col items-center gap-1 text-xs font-medium text-neutral-900 dark:text-neutral-50">
          <List className="w-5 h-5" />
          Feed
        </button>
        <button className="flex flex-col items-center gap-1 text-xs font-medium text-neutral-400">
          <User className="w-5 h-5" />
          Profile
        </button>
      </div>

      <NewReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}
