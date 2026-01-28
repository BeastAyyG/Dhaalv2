"use client";

import { useState } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Header } from "@/components/ui/header";
import { SkeletonCard } from "@/components/ui/badges";
import { Plus, Map as MapIcon, List, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading] = useState(false); // For demo skeleton

  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const categories = [...new Set(reports.map(r => r.category))];

  const filteredReports = selectedCategory
    ? reports.filter(r => r.category === selectedCategory)
    : reports;

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === "OPEN").length,
    inProgress: reports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
  };

  const handleLocateReport = () => {
    setViewMode("map");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      <Header />

      <main className="pt-[5.5rem] pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Hero */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">
              Community <span className="gradient-text">Reports</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Empowering citizens to build better cities
            </p>
          </header>

          {/* Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Report statistics">
            <div className="glass-card-static p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">{stats.total}</div>
                  <div className="text-[11px] text-[var(--text-subtle)]">Total</div>
                </div>
              </div>
            </div>

            <div className="glass-card-static p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--warning-bg)] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[var(--warning)]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xl font-semibold font-mono text-[var(--warning)]">{stats.open}</div>
                  <div className="text-[11px] text-[var(--text-subtle)]">Open</div>
                </div>
              </div>
            </div>

            <div className="glass-card-static p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xl font-semibold font-mono text-[var(--info)]">{stats.inProgress}</div>
                  <div className="text-[11px] text-[var(--text-subtle)]">Progress</div>
                </div>
              </div>
            </div>

            <div className="glass-card-static p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--success-bg)] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xl font-semibold font-mono text-[var(--success)]">{stats.resolved}</div>
                  <div className="text-[11px] text-[var(--text-subtle)]">Resolved</div>
                </div>
              </div>
            </div>
          </section>

          {/* Controls */}
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            {/* View Toggle */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]"
              role="tablist"
              aria-label="View mode"
            >
              <button
                onClick={() => setViewMode("feed")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  viewMode === "feed"
                    ? "bg-[var(--brand)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
                role="tab"
                aria-selected={viewMode === "feed"}
                aria-controls="feed-panel"
              >
                <List className="w-4 h-4" aria-hidden="true" />
                Feed
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  viewMode === "map"
                    ? "bg-[var(--brand)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
                role="tab"
                aria-selected={viewMode === "map"}
                aria-controls="map-panel"
              >
                <MapIcon className="w-4 h-4" aria-hidden="true" />
                Map
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar" role="group" aria-label="Filter by category">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                  !selectedCategory
                    ? "bg-[var(--brand)] text-white border-transparent"
                    : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]"
                )}
                aria-pressed={!selectedCategory}
              >
                All
              </button>
              {categories.slice(0, 4).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                    selectedCategory === cat
                      ? "bg-[var(--brand)] text-white border-transparent"
                      : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]"
                  )}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Map Panel */}
            <div
              id="map-panel"
              className={cn(
                "h-[350px] md:h-[550px] rounded-xl overflow-hidden glass-card-static p-0",
                viewMode === "feed" && "hidden md:block"
              )}
              role="tabpanel"
              aria-labelledby="map-tab"
            >
              <MapView
                reports={filteredReports}
                center={defaultCenter}
                onMarkerClick={handleLocateReport}
              />
            </div>

            {/* Feed Panel */}
            <div
              id="feed-panel"
              className={cn(
                "space-y-4",
                viewMode === "map" && "hidden md:block"
              )}
              role="tabpanel"
              aria-labelledby="feed-tab"
            >
              {isLoading ? (
                // Skeleton Loading
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredReports.length === 0 ? (
                <div className="glass-card-static p-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-[var(--info)]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">No Reports Yet</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">
                    Be the first to report an issue in your area
                  </p>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="btn-cta"
                  >
                    Create Report
                  </button>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
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

      {/* FAB */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-xl btn-cta shadow-xl"
        aria-label="Create new report"
      >
        <Plus className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Mobile Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 glass-card-static rounded-t-xl rounded-b-none border-b-0"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14 px-4">
          <button
            onClick={() => setViewMode("feed")}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[10px] font-medium py-2 px-4 rounded-lg transition-colors",
              viewMode === "feed"
                ? "text-[var(--brand-light)] bg-[var(--info-bg)]"
                : "text-[var(--text-muted)]"
            )}
            aria-current={viewMode === "feed" ? "page" : undefined}
          >
            <List className="w-5 h-5" aria-hidden="true" />
            Feed
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[10px] font-medium py-2 px-4 rounded-lg transition-colors",
              viewMode === "map"
                ? "text-[var(--brand-light)] bg-[var(--info-bg)]"
                : "text-[var(--text-muted)]"
            )}
            aria-current={viewMode === "map" ? "page" : undefined}
          >
            <MapIcon className="w-5 h-5" aria-hidden="true" />
            Map
          </button>
          <a
            href="/analytics"
            className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-[var(--text-muted)] py-2 px-4 rounded-lg"
          >
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
            Stats
          </a>
        </div>
      </nav>

      <NewReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
