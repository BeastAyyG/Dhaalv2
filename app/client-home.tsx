"use client";

import { useState } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Plus, Map as MapIcon, List, User, Sun, Moon, LogIn, LogOut } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  // Default Center (Bangalore) - In real app, calculate from reports or user loc
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">

      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-20 shrink-0">
        <h1 className="font-bold text-xl tracking-tight">Dhaal 🛡️</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
            1,250 XP
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
              title={user.phone || "User"}
            >
              {user.phone?.slice(-2) || "U"}
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-medium"
            >
              <LogIn className="w-3 h-3" /> Login
            </Link>
          )}
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
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <span className="text-sm text-neutral-500">Bangalore, IN</span>
                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                )}
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
