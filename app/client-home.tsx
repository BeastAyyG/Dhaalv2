"use client";

import { useState, useRef } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Header } from "@/components/ui/header";
import { Plus, Map as MapIcon, List, Filter, TrendingUp } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Default Center (Bangalore)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  // Get unique categories
  const categories = [...new Set(reports.map(r => r.category))];

  // Filter reports
  const filteredReports = selectedCategory
    ? reports.filter(r => r.category === selectedCategory)
    : reports;

  // Stats
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === "OPEN").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
  };

  const handleLocateReport = (report: Report) => {
    setViewMode("map");
    // TODO: Pan to report location
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <Header />

      {/* Main Content - Pushed down for fixed header */}
      <main className="pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Hero Section */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Community <span className="gradient-text">Reports</span>
            </h1>
            <p className="text-[var(--muted)]">
              {stats.total} issues reported · {stats.open} open · {stats.resolved} resolved
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stats.total}</div>
              <div className="text-xs text-[var(--muted)]">Total Reports</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{stats.open}</div>
              <div className="text-xs text-[var(--muted)]">Open Issues</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-xs text-[var(--muted)]">Resolved</div>
            </div>
          </div>

          {/* View Toggle & Filters */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--border)]">
              <button
                onClick={() => setViewMode("feed")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === "feed"
                    ? "bg-[var(--card)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <List className="w-4 h-4" />
                Feed
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === "map"
                    ? "bg-[var(--card)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  !selectedCategory
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--border)] hover:bg-[var(--primary)]/10"
                )}
              >
                All
              </button>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--border)] hover:bg-[var(--primary)]/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Left: Map */}
            <div className={cn(
              "h-[400px] md:h-[600px] rounded-2xl overflow-hidden glass-card p-0",
              viewMode === "feed" && "hidden md:block"
            )}>
              <MapView
                reports={filteredReports}
                center={defaultCenter}
                onMarkerClick={handleLocateReport}
              />
            </div>

            {/* Right: Feed */}
            <div className={cn(
              "space-y-4",
              viewMode === "map" && "hidden md:block"
            )}>
              {filteredReports.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="font-bold text-lg mb-2">No Reports Yet</h3>
                  <p className="text-[var(--muted)] text-sm">
                    Be the first to report an issue in your area!
                  </p>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <div key={report.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ReportCard
                      report={report}
                      onLocate={handleLocateReport}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 rounded-2xl btn-primary shadow-xl shadow-emerald-500/30 flex items-center justify-center z-50 animate-pulse-glow"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-t-2xl rounded-b-none">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setViewMode("feed")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
              viewMode === "feed" ? "text-[var(--primary)]" : "text-[var(--muted)]"
            )}
          >
            <List className="w-5 h-5" />
            Feed
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
              viewMode === "map" ? "text-[var(--primary)]" : "text-[var(--muted)]"
            )}
          >
            <MapIcon className="w-5 h-5" />
            Map
          </button>
          <button className="flex flex-col items-center gap-1 text-xs font-medium text-[var(--muted)]">
            <TrendingUp className="w-5 h-5" />
            Analytics
          </button>
        </div>
      </nav>

      {/* Report Modal */}
      <NewReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
